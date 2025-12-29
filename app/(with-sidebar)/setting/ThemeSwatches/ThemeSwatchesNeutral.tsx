"use client";

import { memo, useCallback, useMemo } from "react";
import { shallow } from "zustand/shallow";

import { useSettings } from "@/store/settings";
import { cn } from "@/utils/tools";

const ThemeSwatchesNeutral = memo(() => {
  const { neutralColor, setSettings } = useSettings(
    (s) => ({
      neutralColor: s.settings.neutralColor,
      setSettings: s.setSettings,
    }),
    shallow,
  );

  const options = useMemo(
    () => [
      { key: "", className: "bg-muted", label: "Default" },
      { key: "slate", className: "bg-slate-500", label: "Slate" },
      { key: "gray", className: "bg-gray-500", label: "Gray" },
      { key: "zinc", className: "bg-zinc-500", label: "Zinc" },
      { key: "neutral", className: "bg-neutral-500", label: "Neutral" },
      { key: "stone", className: "bg-stone-500", label: "Stone" },
    ],
    [],
  );

  const select = useCallback(
    (key: string) => {
      setSettings({ neutralColor: key });
    },
    [setSettings],
  );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = neutralColor === opt.key;
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

ThemeSwatchesNeutral.displayName = "ThemeSwatchesNeutral";

export default ThemeSwatchesNeutral;
