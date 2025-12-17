/**
 * Settings Store：actions（写入与状态更新）。
 *
 * - 定义 settings store 的所有写操作（reset / patch / UI 切换等）
 * - 通过 `StateCreator` 组合进 store，保持“状态结构”和“更新逻辑”解耦
 */
import type { StateCreator } from "zustand/vanilla";

import type { ConfigSettings } from "@/types/exportConfig";

import type { SidebarTabKey } from "./initialState";
import { DEFAULT_SETTINGS, type GlobalSettingsState } from "./initialState";
import type { SettingsStore } from "./store";

export interface SettingsAction {
  resetSettings: () => void;
  setGlobalSettings: (settings: GlobalSettingsState) => void;
  setSettings: (settings: Partial<ConfigSettings>) => void;
  switchSideBar: (key: SidebarTabKey) => void;
}

export const createSettings: StateCreator<
  SettingsStore,
  [["zustand/devtools", never]],
  [],
  SettingsAction
> = (set, get) => ({
  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
  },
  setGlobalSettings: (settings) => {
    set({ ...settings });
  },
  setSettings: (settings) => {
    const oldSetting = get().settings;
    set({ settings: { ...oldSetting, ...settings } });
  },
  switchSideBar: (key) => {
    set({ sidebarKey: key });
  },
});
