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
