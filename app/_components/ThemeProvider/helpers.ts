import type { ResolvedTheme, ThemeMode } from "./interface";

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "light" || mode === "dark") return mode;
  return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function readStoredMode(storageKey: string, defaultMode: ThemeMode) {
  const value = globalThis.localStorage?.getItem(
    storageKey,
  ) as ThemeMode | null;
  if (value === "system" || value === "light" || value === "dark") return value;
  return defaultMode;
}

export function writeStoredMode(storageKey: string, mode: ThemeMode) {
  globalThis.localStorage?.setItem(storageKey, mode);
}
