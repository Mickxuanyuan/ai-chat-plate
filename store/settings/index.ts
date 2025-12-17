import { devtools, type PersistOptions, persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import { createStore, type SettingsStore } from "./store";

export const LOBE_SETTINGS = "LOBE_SETTINGS";

const persistOptions: PersistOptions<SettingsStore> = {
  name: LOBE_SETTINGS,
  skipHydration: true,
};

export const useSettings = createWithEqualityFn<SettingsStore>()(
  persist(
    devtools(createStore, {
      name: LOBE_SETTINGS,
    }),
    persistOptions,
  ),
);

export * from "./selectors";
export type { SettingsStore } from "./store";
