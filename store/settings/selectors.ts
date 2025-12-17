/**
 * Settings Store：selectors（派生读取）。
 *
 * - 用于从 `SettingsStore` 中读取“当前生效设置”（将持久化的用户设置与默认值合并）
 * - 只做纯函数选择与兜底，不负责写入/副作用
 */
import { defaults } from "lodash-es";

import { DEFAULT_SETTINGS } from "@/store/settings/initialState";

import type { SettingsStore } from "./store";

const currentSettings = (s: SettingsStore) =>
  defaults(s.settings, DEFAULT_SETTINGS);

export const settingsSelectors = {
  currentSettings,
};
