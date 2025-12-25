"use client";

import { Timer } from "lucide-react";
import { memo } from "react";

import { cn } from "@/utils/tools";

interface HistoryDividerProps {
  enable?: boolean;
  text?: string;
}

const HistoryDivider = memo<HistoryDividerProps>(({ enable, text }) => {
  if (!enable) return null;

  return (
    <div className="flex items-center gap-3 px-5">
      <span className="h-px flex-1 bg-border" />
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1",
          "bg-background text-xs text-muted-foreground",
        )}
      >
        <Timer className="h-3.5 w-3.5" />
        {text || "History Message"}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
});

HistoryDivider.displayName = "HistoryDivider";

export default HistoryDivider;
