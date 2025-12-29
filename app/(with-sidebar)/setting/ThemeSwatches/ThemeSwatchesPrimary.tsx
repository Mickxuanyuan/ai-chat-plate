"use client";

import { memo, useCallback, useMemo } from "react";
import { shallow } from "zustand/shallow";

import { useSettings } from "@/store/settings";
import { cn } from "@/utils/tools";

const ThemeSwatchesPrimary = memo(() => {
  const { primaryColor, setSettings } = useSettings(
    (s) => ({
      primaryColor: s.settings.primaryColor,
      setSettings: s.setSettings,
    }),
    shallow,
  );

  const options = useMemo(
    () => [
      { key: "", className: "bg-muted", label: "Default" },
      { key: "blue", className: "bg-blue-500", label: "Blue" },
      { key: "emerald", className: "bg-emerald-500", label: "Emerald" },
      { key: "violet", className: "bg-violet-500", label: "Violet" },
      { key: "rose", className: "bg-rose-500", label: "Rose" },
      { key: "amber", className: "bg-amber-500", label: "Amber" },
    ],
    [],
  );

  const select = useCallback(
    (key: string) => {
      setSettings({ primaryColor: key });
    },
    [setSettings],
  );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = primaryColor === opt.key;
        return (
          <button
            key={opt.key || "default"}
            type="button"
            aria-label={opt.label}
            title={opt.label}
            className={cn(
              "h-7 w-7 rounded-full border transition-transform",
              opt.className,
              active ? "ring-2 ring-ring ring-offset-2" : "hover:scale-[1.03]",
            )}
            onClick={() => select(opt.key)}
          />
        );
      })}
    </div>
  );
});

ThemeSwatchesPrimary.displayName = "ThemeSwatchesPrimary";

export default ThemeSwatchesPrimary;
