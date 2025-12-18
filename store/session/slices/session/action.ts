/**
 * Session Slice：actions（会话增删改与路由切换）。
 *
 * - 创建/删除/切换会话
 * - 通过 `dispatchSession -> sessionsReducer` 更新 sessions 数据
 * - 与 Next Router 联动，切换会话时同步更新路由
 */
import type { StateCreator } from "zustand/vanilla";

import type { SessionStore } from "@/store/session";
import { LanguageModel } from "@/types/llm";
import { type LobeAgentSession, LobeSessionType } from "@/types/session";
import { uuid } from "@/utils/uuid";

import { type SessionDispatch, sessionsReducer } from "./reducers/session";

export interface SessionAction {
  /**
   * @title 激活会话
   * @param sessionId - 会话 ID
   * @returns void
   */
  activeSession: (sessionId: string) => void;
  /**
   * @title 添加会话
   * @param session - 会话信息
   * @returns void
   */
  createSession: () => Promise<string>;

  /**
   * 分发聊天记录
   * @param payload - 聊天记录
   */
  dispatchSession: (payload: SessionDispatch) => void;
  /**
   * @title 删除会话
   * @param index - 会话索引
   * @returns void
   */
  removeSession: (sessionId: string) => void;

  /**
   * @title 切换会话
   * @param sessionId - 会话索引
   * @returns void
   */
  switchSession: (sessionId?: string | "new") => Promise<void>;

  /**
   * 生成压缩后的消息
   * @returns 压缩后的消息
   */
  // genShareUrl: () => string;
}

export const createSessionSlice: StateCreator<
  SessionStore,
  [["zustand/devtools", never]],
  [],
  SessionAction
> = (set, get) => ({
  activeSession: (sessionId) => {
    /** 更新当前激活会话 id */
    set({ activeId: sessionId });
  },

  createSession: async () => {
    const { dispatchSession, switchSession } = get();

    /** 创建时间戳（createAt/updateAt 同步） */
    const timestamp = Date.now();

    /** 新会话对象（初始为空聊天 + 默认 agent 配置） */
    const newSession: LobeAgentSession = {
      chats: {},
      config: {
        model: LanguageModel.GPT3_5,
        params: {
          temperature: 0.6,
        },
        systemRole: "",
      },
      createAt: timestamp,
      id: uuid(),
      meta: {},
      type: LobeSessionType.Agent,
      updateAt: timestamp,
    };

    dispatchSession({ session: newSession, type: "addSession" });

    await switchSession(newSession.id);

    return newSession.id;
  },

  dispatchSession: (payload) => {
    const { type, ...res } = payload;
    set({ sessions: sessionsReducer(get().sessions, payload) }, false, {
      payload: res,
      type: `dispatchChat/${type}`,
    });
  },

  removeSession: (sessionId) => {
    get().dispatchSession({ id: sessionId, type: "removeSession" });
  },

  switchSession: async (sessionId) => {
    if (get().activeId === sessionId) return;

    if (sessionId) {
      get().activeSession(sessionId);
    }
  },

  // genShareUrl: () => {
  //   const session = sessionSelectors.currentSession(get());
  //   if (!session) return '';
  //
  //   const agent = session.config;
  //   return genShareMessagesUrl(session.chats, agent.systemRole);
  // },
});
