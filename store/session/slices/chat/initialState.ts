/**
 * Chat Slice：state（聊天 UI 相关状态）。
 *
 * - 只存放 UI/交互相关状态（loading、正在编辑的 messageId 等）
 * - 聊天消息内容本身存放在 session 的 `chats`（见 `slices/chat/messageReducer` 与 session reducer）
 */
export interface ChatState {
  /** 是否正在请求/生成 AI 回复（SSE 期间为 true） */
  chatLoading: boolean;
  /** 当前处于编辑态的消息 ID（可选） */
  editingMessageId?: string;
}

export const initialChatState: ChatState = {
  chatLoading: false,

  // activeId: null,
  // searchKeywords: '',
  //
};
