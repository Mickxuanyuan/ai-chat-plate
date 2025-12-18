/**
 * `utils/fetch.ts`
 *
 * 这个文件用于封装“流式（SSE/ReadableStream）拉取文本”的通用能力，并对 AI 任务请求做一层统一编排：
 *
 * - `fetchSSE`：负责从 `Response.body` 读取流式数据，并把每个 chunk 通过回调抛出去
 * - `fetchAIFactory`：把一个“返回 Response 的 fetcher”包装成标准化的任务执行函数：
 *   - 管理 loading 状态
 *   - 统一错误处理（包含 HTTP 状态码 -> 友好文案）
 *   - 透传 abort 信号用于取消请求
 *
 * 注意：
 * - 这里没有做“缓存/去重/失效”等能力；它的目标是“执行一次流式任务并持续输出”
 * - 具体请求地址/协议由 `fetchChatModel` 决定（通常命中 `/api/openai(-dev)` 之类的后端转发）
 */

// import { notification } from '@/layout';
import { fetchChatModel } from '@/services/chatModel';
import { ChatMessageError } from '@/types/chatMessage';

/**
 * HTTP 状态码 -> 友好提示文案映射。
 * - 用于 `fetchSSE` 在 `response.ok === false` 时构造 `ChatMessageError`
 * - 只覆盖常见状态码；未命中时会使用 `undefined`（调用方可自行兜底）
 */
const codeMessage: Record<number, string> = {
  200: '成功获取数据，服务已响应',
  201: '操作成功，数据已保存',
  202: '您的请求已进入后台排队，请耐心等待异步任务完成',
  204: '数据已成功删除',
  400: '很抱歉，您的请求出错，服务器未执行任何数据的创建或修改操作',
  401: '很抱歉，您的权限不足。请确认用户名或密码是否正确',
  403: '很抱歉，您无权访问此内容',
  404: '很抱歉，您请求的记录不存在，服务器未能执行任何操作',
  406: '很抱歉，服务器不支持该请求格式',
  410: '很抱歉，你所请求的资源已永久删除',
  422: '很抱歉，在创建对象时遇到验证错误，请稍后再试',
  500: '很抱歉，服务器出现了问题，请稍后再试',
  502: '很抱歉，您遇到了网关错误。这可能是由于网络故障或服务器问题导致的。请稍后再试，或联系管理员以获取更多帮助',
  503: '很抱歉，我们的服务器过载或处在维护中，服务暂时不可用',
  504: '很抱歉，网关请求超时，请稍后再试',
};

export interface FetchSSEOptions {
  /**
   * 连接/请求错误回调（仅在 HTTP 非 2xx 时触发）。
   * - 例如 401/403/500 等
   * - 注意：网络异常/读取流异常不会走这里，而是由 `fetchSSE(...).catch(...)` 捕获
   */
  onErrorHandle?: (error: ChatMessageError) => void;
  /**
   * 流式消息回调：每读到一段文本（chunk）就触发一次。
   * - chunk 不是“句子/段落”的语义边界，只是底层流的分片
   * - UI 层通常需要做累加：`output += chunk`
   */
  onMessageHandle?: (text: string) => void;
}

/**
 * 使用流式方法获取数据（读取 Response.body 的 ReadableStream）。
 *
 * 工作流程：
 * 1) 执行 `fetchFn()` 得到 `Response`
 * 2) 若 `response.ok === false`：按状态码构造 `ChatMessageError`，调用 `onErrorHandle` 后返回
 * 3) 若 `response.body` 存在：循环 `reader.read()` 读取 chunk
 * 4) 将每次读取到的 chunk 通过 `TextDecoder` 解码成字符串，回调 `onMessageHandle`
 * 5) 读取完成后返回 `response.clone()`（方便调用方继续 `text()`/`json()` 等）
 *
 * @param fetchFn - 返回 `Response` 的函数（通常是 `fetch(...)` 或其封装），便于延迟执行与注入 signal
 * @param options - 回调集合（错误/消息）
 * @returns `Response | undefined`：成功时返回 `Response.clone()`；失败或无 body 时返回 `undefined`
 */
export const fetchSSE = async (fetchFn: () => Promise<Response>, options: FetchSSEOptions = {}) => {
  const response = await fetchFn();

  // 如果不 ok 说明有连接请求错误
  if (!response.ok) {
    const chatMessageError: ChatMessageError = {
      message: codeMessage[response.status],
      status: response.status,
      type: 'general',
    };

    options.onErrorHandle?.(chatMessageError);
    return;
  }

  // clone 一份用于最终返回；原始 response 的 body 会被下面的 reader 消费
  const returnRes = response.clone();

  const data = response.body;

  // 某些场景（或被浏览器/环境限制）可能没有可读流
  if (!data) return;

  const reader = data.getReader();
  const decoder = new TextDecoder();

  let done = false;

  // 逐段读取流，并把每个 chunk 交给上层回调进行 UI 更新/累加
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);

    options.onMessageHandle?.(chunkValue);
  }

  return returnRes;
};

interface FetchAITaskResultParams<T> {
  /**
   * 取消控制器：
   * - 传入后内部会把 `abortController.signal` 传给 fetcher
   * - 当 `abortController.abort()` 被调用后，fetch 会被中断，且内部会视为“主动取消”不回调 `onError`
   */
  abortController?: AbortController;
  /**
   * 错误处理函数（统一出口）。
   * - HTTP 非 2xx：由 `fetchSSE` 转成 `ChatMessageError` 再转换为 `Error(message)` 回调
   * - 网络异常/读取流异常：由 `catch` 捕获后回调
   * - 主动取消：不会触发
   */
  onError?: (e: Error) => void;
  /**
   * 加载状态变化处理函数
   * @param loading - 是否处于加载状态
   */
  onLoadingChange?: (loading: boolean) => void;
  /**
   * 流式消息处理函数（chunk 级别）。
   * @param text - 消息内容
   */
  onMessageHandle?: (text: string) => void;

  /**
   * 请求参数：会原样透传给 `fetcher(params, signal)`
   */
  params: T;
}

export const fetchAIFactory =
  <T>(fetcher: (params: T, signal?: AbortSignal) => Promise<Response>) =>
  /**
   *  传入一个函数 返回一个函数 这个函数是AI任务执行器
   * `fetchAIFactory` 返回的函数签名是统一的“AI 任务执行器”：
   *
   * - 你提供 `params`（请求体/提示词/消息列表等）
   * - 你提供 `onMessageHandle` 用于接收 SSE chunk 并更新 UI
   * - 它会在合适的时机触发 `onLoadingChange`
   * - 它会把各种错误归一化后触发 `onError`
   *
   * @returns Promise<string | undefined>
   * - 成功：返回最终完整文本（`Response.text()`）
   * - 失败/取消：返回 `undefined`
   */
  async ({
    params,
    onMessageHandle,
    onError,
    onLoadingChange,
    abortController,
  }: FetchAITaskResultParams<T>) => {
    /**
     * 内部统一错误处理：
     * - 优先判断是否为主动取消：取消时直接吞掉，不做错误提示
     * - 其余情况交给外部 `onError`
     */
    const errorHandle = (error: Error) => {
      onLoadingChange?.(false);
      if (abortController?.signal.aborted) {
        return;
      }

      onError?.(error);
    };

    onLoadingChange?.(true);

    // 通过 fetchSSE 读取流，并把 chunk 交给 onMessageHandle（外部通常会做累加）
    const data = await fetchSSE(() => fetcher(params, abortController?.signal), {
      onErrorHandle: (error) => {
        errorHandle(new Error(error.message));
      },
      onMessageHandle,
    }).catch(errorHandle);

    onLoadingChange?.(false);

    return await data?.text();
  };

/**
 * 预置任务执行器：
 * - 基于 `fetchChatModel`（对话模型请求）
 * - 对外提供一个“给 prompt/payload -> 返回最终文本”的快捷入口
 *
 * 用法示例：
 * ```ts
 * const result = await fetchPresetTaskResult({
 *   params: promptSummaryDescription("..."),
 *   onLoadingChange: setLoading,
 *   onMessageHandle: (chunk) => { output += chunk; },
 *   onError: console.error,
 * })
 * ```
 */
export const fetchPresetTaskResult = fetchAIFactory(fetchChatModel);
