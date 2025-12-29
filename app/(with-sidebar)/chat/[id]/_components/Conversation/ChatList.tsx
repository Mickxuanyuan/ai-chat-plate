"use client";

import { isEqual } from "lodash-es";
import { memo } from "react";
import { shallow } from "zustand/shallow";

import ChatList, {
  type ChatListActionType,
} from "@/app/_components/chat/ChatList";
import { chatSelectors, useSessionStore } from "@/store/session";

const List = () => {
  const data = useSessionStore(chatSelectors.currentChats, isEqual);
  const isGenerating = useSessionStore((s) => s.chatLoading, shallow);
  const [deleteMessage, resendMessage] = useSessionStore(
    (s) => [s.deleteMessage, s.resendMessage],
    shallow,
  );

  const generatingMessageId = isGenerating
    ? [...data].reverse().find((m) => m.role === "assistant")?.id
    : undefined;

  return (
    <ChatList
      data={data}
      className="pt-6"
      loadingId={generatingMessageId}
      onActionClick={(action: ChatListActionType, id: string) => {
        switch (action) {
          case "delete": {
            deleteMessage(id);
            break;
          }

          case "regenerate": {
            resendMessage(id);
            break;
          }
        }
      }}
    />
  );
};

export default memo(List);
