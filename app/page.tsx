"use client";

import { useTheme } from "./_components/ThemeProvider";

export default function Home() {
  const { mode, resolvedTheme, setMode } = useTheme();

  return (
    <div>
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-6">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Theme: {mode}（{resolvedTheme}）
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
            onClick={() => setMode("system")}
          >
            system
          </button>
          <button
            type="button"
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
            onClick={() => setMode("light")}
          >
            light
          </button>
          <button
            type="button"
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
            onClick={() => setMode("dark")}
          >
            dark
          </button>
        </div>
      </div>
    </div>
  );
}
