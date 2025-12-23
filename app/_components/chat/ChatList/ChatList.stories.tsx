import type { Meta, StoryObj } from "@storybook/react";

import type { ChatMessage } from "@/types/chatMessage";

import ChatList from "./ChatList";

const meta: Meta<typeof ChatList> = {
  title: "app/chat/ChatList",
  component: ChatList,
};

export default meta;
type Story = StoryObj<typeof ChatList>;

const data: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "你好，我是 AI 助手。",
    meta: { title: "Assistant" },
    createAt: 1_700_000_000_000,
    updateAt: 1_700_000_000_000,
  },
  {
    id: "2",
    role: "user",
    content: "帮我把这个组件改成更符合项目规范的写法。",
    meta: { title: "Me" },
    createAt: 1_700_000_000_100,
    updateAt: 1_700_000_000_100,
  },
];

export const Bubble: Story = {
  render: () => {
    return (
      <div className="h-[520px] w-full overflow-auto rounded-md border bg-background">
        <ChatList data={data} />
      </div>
    );
  },
};

export const Docs: Story = {
  render: () => {
    return (
      <div className="h-[520px] w-full overflow-auto rounded-md border bg-background">
        <ChatList data={data} variant="docs" />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    return (
      <div className="h-[520px] w-full overflow-auto rounded-md border bg-background">
        <ChatList data={data} loadingId="2" />
      </div>
    );
  },
};
