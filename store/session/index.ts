import { devtools, type PersistOptions, persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import { createStore, type SessionStore } from "./store";

type SessionPersist = Pick<SessionStore, "sessions">;

export const CHAT_SESSION = "CHAT_SESSION";

const persistOptions: PersistOptions<SessionStore, SessionPersist> = {
  name: CHAT_SESSION,

  /**
   * `partialize` 用来“裁剪需要持久化的字段”。
   *
   * - 这里仅持久化 `sessions`（会话列表/会话数据）
   * - 其余运行时状态（例如 UI 临时状态、派生数据等）不会写入 localStorage，避免污染/膨胀与旧状态副作用
   */
  partialize: (s) => ({
    sessions: s.sessions,
  }),

  // 手动控制 Hydration ，避免 ssr 报错
  skipHydration: true,

  /**
   * 持久化数据的 schema 版本号。
   *
   * - 当你调整了持久化结构（字段名变更、数据结构调整等），应递增 `version`
   * - 并配合 `migrate`（或注释里的 Migration）把旧数据迁移到新结构，避免读取旧数据时报错/数据错乱
   */
  version: 0,
  // version: Migration.targetVersion,
};

export const useSessionStore = createWithEqualityFn<SessionStore>()(
  persist(
    devtools(createStore, {
      name: CHAT_SESSION,
    }),
    persistOptions,
  ),
);

export * from "./selectors";
export type { SessionStore } from "./store";
