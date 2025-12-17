/**
 * Chat Slice：message reducer（对单个会话的 messages map 做增删改）。
 *
 * - 采用 `ChatMessageMap`（id -> message）存储，便于 O(1) 更新
 * - reducer 仅做纯数据变换，不做任何副作用
 */
import { produce } from "immer";

import type { ChatMessage, ChatMessageMap } from "@/types/chatMessage";
import type { LLMRoleType } from "@/types/llm";
import type { MetaData } from "@/types/meta";
import { nanoid } from "@/utils/uuid";

interface AddMessage {
  id?: string;
  message: string;
  meta?: MetaData;
  parentId?: string;
  quotaId?: string;
  role: LLMRoleType;
  type: "addMessage";
}

interface DeleteMessage {
  id: string;
  type: "deleteMessage";
}

interface ResetMessages {
  type: "resetMessages";
}

interface UpdateMessage {
  id: string;
  key: keyof ChatMessage;
  type: "updateMessage";
  value: ChatMessage[keyof ChatMessage];
}

export type MessageDispatch =
  | AddMessage
  | DeleteMessage
  | ResetMessages
  | UpdateMessage;

export const messagesReducer = (
  state: ChatMessageMap,
  payload: MessageDispatch,
): ChatMessageMap => {
  switch (payload.type) {
    case "addMessage": {
      return produce(state, (draftState) => {
        /** message id：若未传入，则自动生成 */
        const mid = payload.id || nanoid();

        draftState[mid] = {
          content: payload.message,
          createAt: Date.now(),
          id: mid,
          meta: payload.meta || {},
          parentId: payload.parentId,
          quotaId: payload.quotaId,
          role: payload.role,
          updateAt: Date.now(),
        };
      });
    }

    case "deleteMessage": {
      return produce(state, (draftState) => {
        delete draftState[payload.id];
      });
    }

    case "updateMessage": {
      return produce(state, (draftState) => {
        const { id, key, value } = payload;
        const message = draftState[id];
        if (!message) return;

        const writable = message as Record<
          keyof ChatMessage,
          ChatMessage[keyof ChatMessage]
        >;
        writable[key] = value;
        message.updateAt = Date.now();
      });
    }

    case "resetMessages": {
      return {};
    }

    default: {
      throw new Error("暂未实现的 type，请检查 reducer");
    }
  }
};
