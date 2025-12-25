"use client";

import { Fragment, memo } from "react";

import { cn } from "@/utils/tools";

import ChatListItem from "./components/ChatListItem";
import HistoryDivider from "./components/HistoryDivider";
import type { ChatListProps } from "./interface";

const ChatList = memo<ChatListProps>(
  ({
    data,
    className,
    variant = "bubble",
    showAvatar = true,
    showTitle = false,
    enableHistoryCount = false,
    historyCount = 0,
    loadingId,
    text,
    onActionClick,
    onActionsClick,
    onAvatarsClick,
    onMessageChange,
    renderActions,
    renderErrorMessages,
    renderItems,
    renderMessages,
    renderMessagesExtra,
    ...rest
  }) => {
    return (
      <div
        className={cn("flex w-full flex-col gap-4 p-4", className)}
        {...rest}
      >
        {data.map((message, index) => {
          const historyLength = data.length;
          const enableHistoryDivider =
            enableHistoryCount &&
            historyLength > historyCount &&
            historyCount === historyLength - index + 1;

          return (
            <Fragment key={message.id}>
              <HistoryDivider enable={enableHistoryDivider} text={text?.history} />
              {renderItems ? (
                renderItems(
                  message,
                  <ChatListItem
                    message={message}
                    loading={loadingId === message.id}
                    onActionClick={onActionClick}
                    onActionsClick={onActionsClick}
                    onAvatarsClick={onAvatarsClick}
                    onMessageChange={onMessageChange}
                    renderActions={renderActions}
                    renderErrorMessages={renderErrorMessages}
                    renderMessages={renderMessages}
                    renderMessagesExtra={renderMessagesExtra}
                    showAvatar={showAvatar}
                    showTitle={showTitle}
                    text={text}
                    variant={variant}
                  />,
                )
              ) : (
                <ChatListItem
                  message={message}
                  loading={loadingId === message.id}
                  onActionClick={onActionClick}
                  onActionsClick={onActionsClick}
                  onAvatarsClick={onAvatarsClick}
                  onMessageChange={onMessageChange}
                  renderActions={renderActions}
                  renderErrorMessages={renderErrorMessages}
                  renderMessages={renderMessages}
                  renderMessagesExtra={renderMessagesExtra}
                  showAvatar={showAvatar}
                  showTitle={showTitle}
                  text={text}
                  variant={variant}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    );
  },
);

ChatList.displayName = "ChatList";

export default ChatList;
