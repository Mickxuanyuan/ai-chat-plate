"use client";

import { RotateCcw } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import type { ChatMessage } from "@/types/chatMessage";
import { cn } from "@/utils/tools";

import type {
  ChatListActionType,
  ChatListRenderActions,
  ChatListRenderErrorMessages,
  ChatListRenderMessages,
  ChatListRenderMessagesExtra,
  ChatListText,
} from "../interface";
import ChatListItemActions from "./ChatListItemActions";

interface ChatListItemProps {
  loading: boolean;
  message: ChatMessage;
  onActionClick?: (
    action: ChatListActionType,
    id: string,
    message: ChatMessage,
  ) => void;
  onActionsClick?: (
    action: ChatListActionType,
    id: string,
    message: ChatMessage,
  ) => void;
  onAvatarsClick?: (message: ChatMessage) => void;
  onMessageChange?: (id: string, content: string) => void;
  renderActions?: ChatListRenderActions;
  renderErrorMessages?: ChatListRenderErrorMessages;
  renderMessages?: ChatListRenderMessages;
  renderMessagesExtra?: ChatListRenderMessagesExtra;
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
    onActionsClick,
    onAvatarsClick,
    onMessageChange,
    renderActions,
    renderErrorMessages,
    renderMessages,
    renderMessagesExtra,
  }) => {
    const isUser = message.role === "user";
    const title = message.meta?.title;
    const avatar = message.meta?.avatar;
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(message.content);
    const isLoadingPlaceholder = message.content.trim() === "...";

    const handleAction = useCallback(
      async (action: ChatListActionType) => {
        if (action === "copy") {
          try {
            await navigator.clipboard.writeText(message.content);
          } catch {
            // ignore
          }
        }
        if (action === "edit" && onMessageChange && !loading) {
          setDraft(message.content);
          setIsEditing(true);
        }
        onActionsClick?.(action, message.id, message);
        onActionClick?.(action, message.id, message);
      },
      [loading, message, onActionClick, onActionsClick, onMessageChange],
    );

    const containerClassName =
      variant === "docs"
        ? "rounded-lg border bg-background"
        : cn(
            "rounded-2xl border px-4 py-3",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
          );

    const handleSave = useCallback(() => {
      onMessageChange?.(message.id, draft);
      setIsEditing(false);
    }, [draft, message.id, onMessageChange]);

    const handleCancel = useCallback(() => {
      setDraft(message.content);
      setIsEditing(false);
    }, [message.content]);

    const avatarProps = useMemo(
      () =>
        onAvatarsClick
          ? {
              className: "mt-1 cursor-pointer",
              onClick: () => onAvatarsClick(message),
            }
          : { className: "mt-1" },
      [message, onAvatarsClick],
    );

    const defaultActions = (
      <ChatListItemActions onActionClick={handleAction} text={text} />
    );

    const actionSlot =
      loading || isEditing
        ? null
        : renderActions
          ? renderActions(message, defaultActions)
          : defaultActions;

    return (
      <div
        className={cn(
          "group flex w-full items-start gap-3",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        {showAvatar && !isUser ? (
          <Avatar {...avatarProps}>
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

        <div
          className={cn(
            "flex min-w-0 max-w-[720px] flex-col",
            isUser && "items-end",
          )}
        >
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
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <textarea
                  className={cn(
                    "min-h-[96px] w-full resize-y rounded-md border bg-background/80",
                    "px-3 py-2 text-sm text-foreground",
                  )}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="button" size="sm" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            ) : loading && isLoadingPlaceholder ? (
              <div className="flex items-center gap-2 text-sm opacity-80">
                <RotateCcw className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </div>
            ) : message.error && renderErrorMessages ? (
              <div className="text-sm leading-relaxed">
                {renderErrorMessages(message)}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {renderMessages ? renderMessages(message) : message.content}
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : null}
              </div>
            )}

            {!loading && !isEditing && renderMessagesExtra ? (
              <div className="mt-2">{renderMessagesExtra(message)}</div>
            ) : null}

            <div
              className={cn(
                "absolute -bottom-9 right-0 flex items-center gap-1 opacity-0 transition-opacity",
                "group-hover:opacity-100",
              )}
            >
              {actionSlot}
            </div>
          </div>
        </div>

        {showAvatar && isUser ? (
          <Avatar {...avatarProps}>
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
