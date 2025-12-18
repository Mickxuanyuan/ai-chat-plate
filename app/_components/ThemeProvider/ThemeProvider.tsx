"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { readStoredMode, resolveTheme, writeStoredMode } from "./helpers";
import type {
  ThemeContextValue,
  ThemeMode,
  ThemeProviderProps,
} from "./interface";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export default function ThemeProvider({
  children,
  defaultMode = "system",
  storageKey = "theme-mode",
  attribute = "class",
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [systemTheme, setSystemTheme] = useState(() => resolveTheme("system"));

  useEffect(() => {
    setMode(readStoredMode(storageKey, defaultMode));
  }, [defaultMode, storageKey]);

  useEffect(() => {
    if (mode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystemTheme(resolveTheme("system"));

    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [mode]);

  const resolvedTheme = useMemo(
    () => (mode === "system" ? systemTheme : mode),
    [mode, systemTheme],
  );

  useEffect(() => {
    // 单一方案：shadcn/ui & Tailwind `dark:` 都基于 `html.dark`。
    // `app/globals.css` 里也用 `.dark { ... }` 覆盖 CSS 变量。
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setModeAndPersist = useCallback(
    (nextMode: ThemeMode) => {
      setMode(nextMode);
      writeStoredMode(storageKey, nextMode);
    },
    [storageKey],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedTheme,
      setMode: setModeAndPersist,
    }),
    [mode, resolvedTheme, setModeAndPersist],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
