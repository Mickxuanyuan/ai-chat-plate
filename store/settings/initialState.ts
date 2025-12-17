import type { ConfigSettings } from "@/types/exportConfig";

/**
 * 侧边栏当前激活的 Tab Key。
 *
 * - `chat`: 聊天页相关
 * - `market`: 市场/助手列表等（如果后续有该页面/模块）
 */
export type SidebarTabKey = "chat" | "market";

/**
 * 业务侧可导出/可持久化的设置项默认值（会作为全局 settings 的初始值）。
 *
 * 设计要点：
 * - 这里的默认值会决定“首次打开应用”时的体验，以及“重置设置”回到的状态
 * - 数值类配置建议给出安全/通用的默认值，避免请求参数异常或极端值导致的体验问题
 */
export const DEFAULT_SETTINGS: ConfigSettings = {
  /**
   * 系统访问码（可选）。
   * - 用于应用开启“访问控制”时的校验
   * - 为空表示不启用访问码或尚未配置
   */
  accessCode: "",

  /**
   * UI：头像 URL（可选）。
   * - 用于展示当前用户/助手头像等
   * - 为空表示使用默认头像
   */
  avatar: "",

  /**
   * 聊天：历史消息压缩阈值（单位：条）。
   * - 当未压缩的历史消息条数超过该阈值时，系统会触发“压缩/摘要”等策略（具体策略由业务层实现）
   * - 推荐保持与 `historyCount` 同量级，避免每次都压缩或永不压缩
   */
  compressThreshold: 24,

  /**
   * 聊天：是否启用历史消息压缩阈值。
   * - `true`：当消息条数超过 `compressThreshold` 时触发压缩策略
   * - `false`：关闭压缩策略（可能导致长对话更容易超出上下文窗口）
   */
  enableCompressThreshold: true,

  /**
   * 聊天：是否启用“携带历史消息数限制”。
   * - `true`：每次请求只携带最近 `historyCount` 条（或由业务层进一步裁剪）
   * - `false`：不限制携带条数（可能导致请求过大或更易超出模型上下文）
   */
  enableHistoryCount: true,

  /**
   * 模型：是否启用单次回复 `maxTokens` 限制。
   * - `true`：请求会带上 `maxTokens`（限制单次回复 token 上限）
   * - `false`：不传 `maxTokens`（由服务端/模型默认策略决定）
   */
  enableMaxTokens: true,

  /**
   * OpenAI：接口代理地址（可选）。
   * - 为空表示使用默认 OpenAI Endpoint
   * - 若非空，通常需要包含 `http(s)://`
   */
  endpoint: "",

  /**
   * UI：聊天字体大小（px）。
   * - 影响消息列表/输入区等文字大小（具体使用位置由 UI 层决定）
   */
  fontSize: 14,

  /**
   * 模型：频率惩罚（frequency_penalty）。
   * - 值越大越倾向降低重复字词
   * - 一般取值范围：`[-2, 2]`（取决于具体模型/服务端实现）
   */
  frequencyPenalty: 0,

  /**
   * 聊天：每次请求携带的历史消息条数（单位：条）。
   * - 仅在 `enableHistoryCount=true` 时生效
   */
  historyCount: 24,

  /**
   * UI：语言（locale）。
   * - 影响 i18n 当前语言
   * - 例如：`zh-CN` / `en-US`
   */
  language: "zh-CN",

  /**
   * 模型：单次回复 token 上限。
   * - 仅在 `enableMaxTokens=true` 时生效
   * - 具体上限受模型能力与服务端策略限制
   */
  maxTokens: 2000,

  /**
   * 模型：名称（model id）。
   * - 与服务端支持的模型列表对应
   */
  model: "gpt-3.5-turbo",

  /**
   * UI：中性色（可选）。
   * - 作为主题系统的一部分，具体含义由主题实现决定
   */
  neutralColor: "",

  /**
   * 模型：话题新鲜度（presence_penalty）。
   * - 值越大越倾向引入新话题
   * - 一般取值范围：`[-2, 2]`
   */
  presencePenalty: 0,

  /**
   * UI：主题主色（可选）。
   * - 作为主题系统的一部分，具体含义由主题实现决定
   */
  primaryColor: "",

  /**
   * 模型：随机性（temperature）。
   * - 值越大回复越随机
   * - 常见范围：`[0, 2]`
   */
  temperature: 0.5,

  /**
   * UI：主题模式。
   * - `system`：跟随系统偏好
   * - `light` / `dark`：强制主题
   */
  themeMode: "system",

  /**
   * OpenAI：API Key（可选）。
   * - 为空表示未配置
   * - 建议仅在本地/可信环境使用
   */
  token: "",

  /**
   * 模型：核采样（top_p）。
   * - 与 temperature 类似，但通常不建议同时大幅调整两者
   * - 常见范围：`[0, 1]`
   */
  topP: 1,
};

/**
 * 全局设置 Store 的状态结构（包含 UI 状态 + 可持久化设置）。
 *
 * - `settings`: 可导出/可持久化的业务配置（如模型参数、语言、主题等）
 * - 其余字段通常属于 UI 布局状态（输入区高度、侧边栏宽度等）
 */
export interface GlobalSettingsState {
  /**
   * UI：输入框/输入区高度（px）。
   * - 用于布局计算或用户可拖拽调整
   */
  inputHeight: number;

  /**
   * UI：会话列表是否可展开（可选）。
   * - `true`：可展开
   * - `false`：固定
   * - `undefined`：未初始化或由 UI 根据屏幕尺寸决定
   */
  sessionExpandable?: boolean;

  /**
   * UI：会话列表区域宽度（px）。
   */
  sessionsWidth: number;

  /**
   * 可持久化的业务设置（见 `DEFAULT_SETTINGS`）。
   */
  settings: ConfigSettings;

  /**
   * UI：当前侧边栏 Tab。
   */
  sidebarKey: SidebarTabKey;
}

/**
 * 全局设置 Store 的初始状态（运行时初始值）。
 * - `settings` 采用 `DEFAULT_SETTINGS`
 * - 布局相关字段给出一个合理的默认 UI
 */
export const initialState: GlobalSettingsState = {
  /** 输入区默认高度（px） */
  inputHeight: 200,
  /** 会话列表默认可展开 */
  sessionExpandable: true,
  /** 会话列表默认宽度（px） */
  sessionsWidth: 320,
  /** 默认业务设置 */
  settings: DEFAULT_SETTINGS,
  /** 默认 Tab：聊天 */
  sidebarKey: "chat",
};
