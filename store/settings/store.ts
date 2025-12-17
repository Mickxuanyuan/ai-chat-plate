/**
 * Settings Store：store creator（组装状态 + actions）。
 *
 * - 定义 `SettingsStore` 的最终类型（actions + state）
 * - 将 `initialState` 与 `createSettings` 合并，提供给 zustand middleware（devtools/persist）
 */
import type { StateCreator } from "zustand/vanilla";

import { createSettings, type SettingsAction } from "./action";
import { type GlobalSettingsState, initialState } from "./initialState";

export type SettingsStore = SettingsAction & GlobalSettingsState;

export const createStore: StateCreator<
  SettingsStore,
  [["zustand/devtools", never]]
> = (...parameters) => ({
  ...initialState,
  ...createSettings(...parameters),
});
