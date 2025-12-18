export type ThemeMode = "system" | "light" | "dark";

export type ResolvedTheme = "light" | "dark";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
  /**
   * Theme mount strategy.
   * - 推荐仅使用 `"class"`：shadcn/ui 默认方案，通过给 `document.documentElement` 加/删 `dark` class 切换
   */
  attribute?: "class";
};

export type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};
