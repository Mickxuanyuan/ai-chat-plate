"use client";

import ThemeProvider from "./_components/ThemeProvider";
import ThemeSettingsSync from "./ThemeSettingsSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeSettingsSync />
      {children}
    </ThemeProvider>
  );
}
