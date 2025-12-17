/**
 * AgentConfig Slice：state + defaults（会话的“助手/代理配置”相关状态）。
 *
 * 这里主要管理：
 * - 默认 Agent 配置（模型、systemRole、参数等）
 * - Agent 元数据自动补全时的 loading 状态
 * - 是否展示 Agent 配置面板等 UI 状态
 */
import { LanguageModel } from "@/types/llm";
import type { MetaData } from "@/types/meta";
import type { LobeAgentConfig } from "@/types/session";

/**
 * 自动补全的 loading 状态（按 MetaData 的字段维度打点）。
 * - 例如：avatar/title/description 等字段是否正在生成
 */
export type SessionLoadingState = Record<Partial<keyof MetaData>, boolean>;

/**
 * AgentConfig slice 的状态结构（不包含 actions）。
 */
export interface AgentConfigState {
  /** 自动补全 loading 状态集合 */
  autocompleteLoading: SessionLoadingState;

  /** UI：是否展示 Agent 设置面板 */
  showAgentSettings: boolean;
}

/**
 * 新建会话时使用的默认 Agent 配置。
 */
export const initialLobeAgentConfig: LobeAgentConfig = {
  model: LanguageModel.GPT3_5,
  params: { temperature: 0.6 },
  systemRole: "",
};

/**
 * 当会话/Agent 未设置 avatar 时使用的默认头像。
 */
export const DEFAULT_AVATAR =
  "https://npm.elemecdn.com/@lobehub/assets-logo/assets/logo-3d.webp";

/**
 * 新建会话时的默认标题。
 */
export const DEFAULT_TITLE = "默认对话";

/**
 * AgentConfig slice 的初始运行时状态。
 */
export const initialAgentConfigState: AgentConfigState = {
  /** loading 中间态（逐字段） */
  autocompleteLoading: {
    avatar: false,
    backgroundColor: false,
    description: false,
    tag: false,
    title: false,
  },

  showAgentSettings: false,
};
