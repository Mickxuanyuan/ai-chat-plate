"use client";

import { memo } from "react";

import { cn } from "@/utils/tools";

import type { ChatHeaderTitleProps } from "./interface";

const ChatHeaderTitle = memo<ChatHeaderTitleProps>(({ title, desc, tag }) => {
  return (
    <div className="min-w-0 flex-1 overflow-hidden">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "min-w-0 truncate text-sm font-medium",
            desc ? "leading-5" : "leading-6",
          )}
        >
          {title}
        </div>
        {tag ? <div className="shrink-0">{tag}</div> : null}
      </div>
      {desc ? (
        <div className="truncate text-xs text-muted-foreground">{desc}</div>
      ) : null}
    </div>
  );
});

ChatHeaderTitle.displayName = "ChatHeaderTitle";

export default ChatHeaderTitle;
