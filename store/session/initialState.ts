/**
 * Session Store：initial state（组合各 slice 初始状态）。
 *
 * - `SessionStoreState`：由各 slice 的 state 组合而成（不包含 actions）
 * - `initialState`：创建 store 时展开的运行时初始值
 */
import {
  type AgentConfigState,
  initialAgentConfigState,
} from "./slices/agentConfig";
import { type ChatState, initialChatState } from "./slices/chat";
import { initialSessionState, type SessionState } from "./slices/session";

export type SessionStoreState = SessionState & ChatState & AgentConfigState;

export const initialState: SessionStoreState = {
  ...initialSessionState,
  ...initialChatState,
  ...initialAgentConfigState,
};
