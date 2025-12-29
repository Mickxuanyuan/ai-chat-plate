import { memo } from "react";

import ChatList from "./ChatList";
import ChatInput from "./Input";

const Conversation = () => {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChatList />
      </div>
      <ChatInput />
    </div>
  );
};

export default memo(Conversation);
