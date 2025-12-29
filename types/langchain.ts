import type { OpenAIChatMessage, OpenAIStreamPayload } from "./openai";

/**
 * LangChainParams：用于“模板 + 变量”的组装方式来调用 OpenAI Chat Completions。
 *
 * 说明：
 * - 这是为了兼容旧的 LangChain 风格 payload（prompts + vars + llm）
 * - 实际请求仍然会转换为 OpenAI 的 `messages` 与参数，并走流式输出
 */
export type LangChainPrompt = OpenAIChatMessage;

export type LangChainVars = Record<
  string,
  string | number | boolean | null | undefined
>;

export type LangChainLLMParams = Omit<OpenAIStreamPayload, "messages">;

export interface LangChainParams {
  /**
   * Prompt 模板（按 role 排列）。
   * - content 支持 `{var}` 占位符
   */
  prompts: LangChainPrompt[];
  /**
   * 模板变量。
   */
  vars: LangChainVars;
  /**
   * LLM 参数（最终会透传给 OpenAI Chat Completions）。
   */
  llm: LangChainLLMParams;
}
