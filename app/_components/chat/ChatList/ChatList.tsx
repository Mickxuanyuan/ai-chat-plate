"use client";

import { memo } from "react";

import { cn } from "@/utils/tools";

import ChatListItem from "./components/ChatListItem";
import type { ChatListProps } from "./interface";

const ChatList = memo<ChatListProps>(
  ({
    data,
    className,
    variant = "bubble",
    showAvatar = true,
    showTitle = false,
    loadingId,
    text,
    onActionClick,
    onMessageChange,
    ...rest
  }) => {
    return (
      <div
        className={cn("flex w-full flex-col gap-4 p-4", className)}
        {...rest}
      >
        {data.map((message) => (
          <ChatListItem
            key={message.id}
            message={message}
            loading={loadingId === message.id}
            onActionClick={onActionClick}
            onMessageChange={onMessageChange}
            showAvatar={showAvatar}
            showTitle={showTitle}
            text={text}
            variant={variant}
          />
        ))}
      </div>
    );
  },
);

ChatList.displayName = "ChatList";

export default ChatList;
