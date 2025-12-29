"use client";

import { memo, useCallback } from "react";

import { cn } from "@/utils/tools";

export interface SliderWithInputProps {
  defaultValue?: number;
  max: number;
  min: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

const SliderWithInput = memo<SliderWithInputProps>(
  ({ min, max, step = 1, value, defaultValue, onChange }) => {
    const safeValue = Number.isFinite(value) ? value : (defaultValue ?? min);

    const update = useCallback(
      (next: number) => {
        if (!Number.isFinite(next)) return;
        const clamped = Math.min(max, Math.max(min, next));
        onChange(clamped);
      },
      [max, min, onChange],
    );

    return (
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeValue}
          className="flex-1"
          onChange={(e) => update(Number.parseFloat(e.target.value))}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={safeValue}
          className={cn(
            "h-9 w-[88px] rounded-md border bg-background px-2 text-sm tabular-nums",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          )}
          onChange={(e) => update(Number.parseFloat(e.target.value))}
        />
      </div>
    );
  },
);

SliderWithInput.displayName = "SliderWithInput";

export default SliderWithInput;
