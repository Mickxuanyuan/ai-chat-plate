/**
 * Settings Store：public entry（对外入口）。
 *
 * - 创建并导出 `useSettings` hook（集成 devtools + persist）
 * - 统一持久化 key（`CHAT_SETTINGS`）与 hydrate 策略（`skipHydration`）
 * - re-export selectors 与类型，作为该模块的唯一对外出口
 */
import { devtools, type PersistOptions, persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import { createStore, type SettingsStore } from "./store";

export const CHAT_SETTINGS = "CHAT_SETTINGS";

const persistOptions: PersistOptions<SettingsStore> = {
  name: CHAT_SETTINGS,
  skipHydration: true,
};

export const useSettings = createWithEqualityFn<SettingsStore>()(
  persist(
    devtools(createStore, {
      name: CHAT_SETTINGS,
    }),
    persistOptions,
  ),
);

export * from "./selectors";
export type { SettingsStore } from "./store";
