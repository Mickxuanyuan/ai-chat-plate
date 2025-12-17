export type ThemeMode = "system" | "light" | "dark";

export type ResolvedTheme = "light" | "dark";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
  attribute?: "data-theme";
};

export type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};
