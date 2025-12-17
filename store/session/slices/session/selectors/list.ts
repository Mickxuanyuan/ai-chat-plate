/**
 * Session Slice：selectors（会话列表与按 id 查询）。
 *
 * - `currentSessionSel/currentSessionSafe`：读取当前会话（安全兜底）
 * - `chatListSel`：按搜索关键字过滤并排序会话列表
 * - `getSessionById/getSessionMetaById`：按 id 读取会话/元数据
 */
import type { SessionStore } from "@/store/session";
import type { MetaData } from "@/types/meta";
import type { LobeAgentSession } from "@/types/session";
import { filterWithKeywords } from "@/utils/filter";

import { initLobeSession } from "../initialState";

/** 当前会话（可能不存在，返回 `undefined`）。 */
export const currentSessionSel = (
  s: SessionStore,
): LobeAgentSession | undefined => {
  if (!s.activeId) return;

  return s.sessions[s.activeId];
};

/** 当前会话（安全兜底，永不返回 `undefined`）。 */
export const currentSessionSafe = (s: SessionStore): LobeAgentSession => {
  return currentSessionSel(s) || initLobeSession;
};

/**
 * 会话列表（按关键字过滤并按更新时间倒序）。
 */
export const chatListSel = (s: SessionStore) => {
  const filterChats = filterWithKeywords(
    s.sessions,
    s.searchKeywords,
    (item) => [
      Object.values(item.chats)
        .map((c) => c.content)
        .join(""),
    ],
  );

  return Object.values(filterChats).sort(
    (a, b) => (b.updateAt || 0) - (a.updateAt || 0),
  );
};

/**
 * 按 id 获取会话（安全兜底）。
 */
export const getSessionById =
  (id: string) =>
  (s: SessionStore): LobeAgentSession => {
    const session = s.sessions[id];

    if (!session) return initLobeSession;
    return session;
  };

/**
 * 按 id 获取会话的 MetaData（无会话时返回空对象）。
 */
export const getSessionMetaById =
  (id: string) =>
  (s: SessionStore): MetaData => {
    const session = s.sessions[id];

    if (!session) return {};
    return session.meta;
  };

// export const sessionTreeSel = (s: SessionStore) => {
//   const sessionTree: SessionTree = [
//     {
//       agentId: 'default',
//       chats: chatListSel(s)
//         .filter((s) => !s.agentId)
//         .map((c) => c.id),
//     },
//   ];
//
//   Object.values(s.agents).forEach((agent) => {
//     const chats = Object.values(s.chats).filter((s) => s.agentId === agent.id);
//
//     sessionTree.push({
//       agentId: agent.id,
//       chats: chats.map((c) => c.id),
//     });
//   });
//
//   return sessionTree;
// };
