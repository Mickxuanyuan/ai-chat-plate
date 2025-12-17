/**
 * Session Slice：state + defaults（会话列表/当前会话等 UI 状态）。
 *
 * - `sessions`：所有会话数据（id -> session）
 * - `activeId`：当前激活会话 id
 * - `searchKeywords`：会话列表搜索关键字（用于过滤）
 */
import { type LobeAgentSession, LobeSessionType } from "@/types/session";

import { initialLobeAgentConfig } from "../agentConfig";

export interface SessionState {
  /**
   * @title 当前活动的会话
   * @description 当前正在编辑或查看的会话
   * @default null
   */
  activeId: string | null;
  searchKeywords: string;
  sessions: Record<string, LobeAgentSession>;
}

/**
 * 会话对象兜底值（用于 selectors 在 session 不存在时返回一个“可用的空会话”）。
 * 注意：这里的 `createAt/updateAt` 使用初始化时刻，主要用于避免访问 undefined。
 */
export const initLobeSession: LobeAgentSession = {
  chats: {},
  config: initialLobeAgentConfig,
  createAt: Date.now(),
  id: "",
  meta: {},
  type: LobeSessionType.Agent,
  updateAt: Date.now(),
};

export const initialSessionState: SessionState = {
  activeId: null,

  /** 会话列表搜索关键字 */
  searchKeywords: "",
  sessions: {},
};
