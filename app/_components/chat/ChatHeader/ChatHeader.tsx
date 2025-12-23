"use client";

import { ChevronLeft } from "lucide-react";
import { memo } from "react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/utils/tools";

import type { ChatHeaderProps } from "./interface";

const ChatHeader = memo<ChatHeaderProps>(
  ({
    left,
    right,
    className,
    styles: contentStyles,
    gaps,
    classNames,
    showBackButton,
    onBackClick,
    children,
    gap = 16,
    style,
    ...rest
  }) => {
    const leftGap = gaps?.left ?? 12;
    const centerGap = gaps?.center ?? 8;
    const rightGap = gaps?.right ?? 8;

    return (
      <div
        className={cn(
          "flex h-14 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur",
          className,
        )}
        style={{ gap, ...style }}
        {...rest}
      >
        <div
          className={cn("flex min-w-0 flex-1 items-center", classNames?.left)}
          style={{ gap: leftGap, ...contentStyles?.left }}
        >
          {showBackButton ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Back"
              onClick={onBackClick}
              className="-ml-1 h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : null}
          {left}
        </div>

        {children ? (
          <div
            className={cn("flex shrink-0 items-center", classNames?.center)}
            style={{ gap: centerGap, ...contentStyles?.center }}
          >
            {children}
          </div>
        ) : null}

        <div
          className={cn("flex shrink-0 items-center", classNames?.right)}
          style={{ gap: rightGap, ...contentStyles?.right }}
        >
          {right}
        </div>
      </div>
    );
  },
);

ChatHeader.displayName = "ChatHeader";

export default ChatHeader;
