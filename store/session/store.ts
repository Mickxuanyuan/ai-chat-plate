/**
 * Session Store：store creator（组装所有 slice）。
 *
 * - 定义 `SessionStore` 的最终类型：SessionState + Chat + AgentConfig + 对应 actions
 * - 将 `initialState` 与各 slice 的 `createXxxSlice` 合并，提供给 zustand middleware（devtools/persist）
 */
import type { StateCreator } from "zustand/vanilla";

import { initialState, type SessionStoreState } from "./initialState";
import { type AgentAction, createAgentSlice } from "./slices/agentConfig";
import { type ChatAction, createChatSlice } from "./slices/chat";
import { createSessionSlice, type SessionAction } from "./slices/session";

/**
 * Session Store 的完整类型（供 `useSessionStore` 与 selectors 使用）。
 */
export type SessionStore = SessionAction &
  AgentAction &
  ChatAction &
  SessionStoreState;

/**
 * 创建 Session Store（zustand StateCreator）。
 * - 仅负责“组合”，不在这里写业务逻辑
 */
export const createStore: StateCreator<
  SessionStore,
  [["zustand/devtools", never]]
> = (...parameters) => ({
  ...initialState,
  ...createAgentSlice(...parameters),
  ...createSessionSlice(...parameters),
  ...createChatSlice(...parameters),
});
