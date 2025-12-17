/**
 * Session Slice：sessions reducer（对 `sessions` map 做增删改）。
 *
 * - `sessions` 使用 `{ [id]: LobeAgentSession }` 结构，便于按 id 更新
 * - reducer 只做纯数据变换，不做任何副作用（路由跳转等在 action 里处理）
 */
import { produce } from "immer";

import type { ChatMessageMap } from "@/types/chatMessage";
import type { MetaData } from "@/types/meta";
import type {
  LobeAgentConfig,
  LobeAgentSession,
  LobeSessions,
} from "@/types/session";

/**
 * @title 添加会话
 */
interface AddSession {
  /**
   * @param session - 会话信息
   */
  session: LobeAgentSession;
  /**
   * @param type - 操作类型
   * @default 'addChat'
   */
  type: "addSession";
}

interface RemoveSession {
  id: string;
  type: "removeSession";
}

/**
 * @title 更新会话聊天上下文
 */
interface UpdateSessionChat {
  chats: ChatMessageMap;
  /**
   * 会话 ID
   */
  id: string;

  type: "updateSessionChat";
}

interface UpdateSessionMeta {
  id: string;
  key: keyof MetaData;
  type: "updateSessionMeta";
  /** 写入的 meta 值（根据 key 不同可能是 string / string[] 等） */
  value: unknown;
}

interface UpdateSessionAgentConfig {
  config: Partial<LobeAgentConfig>;
  id: string;
  type: "updateSessionConfig";
}

export type SessionDispatch =
  | AddSession
  | UpdateSessionChat
  | RemoveSession
  | UpdateSessionMeta
  | UpdateSessionAgentConfig;

export const sessionsReducer = (
  state: LobeSessions,
  payload: SessionDispatch,
): LobeSessions => {
  switch (payload.type) {
    case "addSession": {
      return produce(state, (draft) => {
        const { session } = payload;
        if (!session) return;

        draft[session.id] = session;
      });
    }

    case "removeSession": {
      return produce(state, (draft) => {
        delete draft[payload.id];
      });
    }

    case "updateSessionMeta": {
      return produce(state, (draft) => {
        const chat = draft[payload.id];
        if (!chat) return;

        const { key, value } = payload;

        /**
         * 允许被更新的 meta 字段白名单。
         * - 避免随意写入未知字段导致 meta 结构膨胀或污染
         */
        const validKeys = [
          "avatar",
          "backgroundColor",
          "description",
          "tag",
          "title",
        ] as const;

        if (validKeys.includes(key as (typeof validKeys)[number])) {
          (chat.meta as Record<string, unknown>)[key as string] = value;
        }
      });
    }

    case "updateSessionChat": {
      return produce(state, (draft) => {
        const chat = draft[payload.id];
        if (!chat) return;

        chat.chats = payload.chats;
      });
    }

    case "updateSessionConfig": {
      return produce(state, (draft) => {
        const { id, config } = payload;
        const chat = draft[id];
        if (!chat) return;

        chat.config = { ...chat.config, ...config };
      });
    }

    default: {
      return produce(state, () => {});
    }
  }
};
