/**
 * Session Slice：selectors 聚合入口。
 *
 * - 将 session 相关 selectors 统一收口对外输出
 */
import { getAgentAvatar } from "./chat";
import {
  chatListSel,
  currentSessionSafe,
  currentSessionSel,
  getSessionById,
  getSessionMetaById,
} from "./list";

/**
 * sessionSelectors：统一对外暴露的读取方法集合。
 */
export const sessionSelectors = {
  chatList: chatListSel,
  currentSession: currentSessionSel,
  currentSessionSafe,

  getAgentAvatar,

  getSessionById,
  // sessionTree: sessionTreeSel,
  getSessionMetaById,
};
