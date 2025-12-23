"use client";

import { Copy, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { memo, useCallback } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import type { ChatMessage } from "@/types/chatMessage";
import { cn } from "@/utils/tools";

import type { ChatListActionType, ChatListText } from "../interface";

interface ChatListItemProps {
  loading: boolean;
  message: ChatMessage;
  onActionClick?: (
    action: ChatListActionType,
    id: string,
    message: ChatMessage,
  ) => void;
  onMessageChange?: (id: string, content: string) => void;
  showAvatar: boolean;
  showTitle: boolean;
  text?: ChatListText;
  variant: "bubble" | "docs";
}

const ChatListItem = memo<ChatListItemProps>(
  ({
    message,
    loading,
    showAvatar,
    showTitle,
    text,
    variant,
    onActionClick,
  }) => {
    const isUser = message.role === "user";
    const title = message.meta?.title;
    const avatar = message.meta?.avatar;

    const handleAction = useCallback(
      async (action: ChatListActionType) => {
        if (action === "copy") {
          try {
            await navigator.clipboard.writeText(message.content);
          } catch {
            // ignore
          }
        }
        onActionClick?.(action, message.id, message);
      },
      [message, onActionClick],
    );

    const containerClassName =
      variant === "docs"
        ? "rounded-lg border bg-background"
        : cn(
            "rounded-2xl border px-4 py-3",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
          );

    return (
      <div
        className={cn(
          "group flex w-full items-start gap-3",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        {showAvatar && !isUser ? (
          <Avatar className="mt-1">
            {typeof avatar === "string" && /^(https?:\/\/|\/)/.test(avatar) ? (
              <AvatarImage alt={title ?? "avatar"} src={avatar} />
            ) : null}
            <AvatarFallback
              style={{ backgroundColor: message.meta?.backgroundColor }}
            >
              {typeof avatar === "string" &&
              avatar &&
              !/^(https?:\/\/|\/)/.test(avatar)
                ? avatar
                : (title ?? "A").slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        ) : null}

        <div className={cn("min-w-0 max-w-[720px]", isUser && "items-end")}>
          {showTitle && title ? (
            <div
              className={cn(
                "mb-1 text-xs text-muted-foreground",
                isUser && "text-right",
              )}
            >
              {title}
            </div>
          ) : null}

          <div className={cn("relative", containerClassName)}>
            {loading ? (
              <div className="flex items-center gap-2 text-sm opacity-80">
                <RotateCcw className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {message.content}
              </div>
            )}

            <div
              className={cn(
                "absolute -bottom-9 right-0 flex items-center gap-1 opacity-0 transition-opacity",
                "group-hover:opacity-100",
              )}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                aria-label={text?.copy ?? "Copy"}
                onClick={() => handleAction("copy")}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                aria-label={text?.edit ?? "Edit"}
                onClick={() => handleAction("edit")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                aria-label={text?.regenerate ?? "Regenerate"}
                onClick={() => handleAction("regenerate")}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                aria-label={text?.delete ?? "Delete"}
                onClick={() => handleAction("delete")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {showAvatar && isUser ? (
          <Avatar className="mt-1">
            {typeof avatar === "string" && /^(https?:\/\/|\/)/.test(avatar) ? (
              <AvatarImage alt={title ?? "avatar"} src={avatar} />
            ) : null}
            <AvatarFallback
              style={{ backgroundColor: message.meta?.backgroundColor }}
            >
              {typeof avatar === "string" &&
              avatar &&
              !/^(https?:\/\/|\/)/.test(avatar)
                ? avatar
                : (title ?? "U").slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        ) : null}
      </div>
    );
  },
);

ChatListItem.displayName = "ChatListItem";

export default ChatListItem;
