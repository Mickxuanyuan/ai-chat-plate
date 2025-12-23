import type { Meta, StoryObj } from "@storybook/react";
import { MoreVertical, Share2 } from "lucide-react";

import { Button } from "@/app/_components/ui/button";

import ChatHeader, { ChatHeaderTitle } from "./index";

const meta: Meta<typeof ChatHeader> = {
  title: "app/chat/ChatHeader",
  component: ChatHeader,
};

export default meta;
type Story = StoryObj<typeof ChatHeader>;

export const Basic: Story = {
  render: () => {
    return (
      <div className="h-14 w-full">
        <ChatHeader
          left={<ChatHeaderTitle title="Default Agent" desc="No description" />}
          right={
            <>
              <Button type="button" variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </>
          }
        />
      </div>
    );
  },
};

export const WithBackButton: Story = {
  render: () => {
    return (
      <div className="h-14 w-full">
        <ChatHeader
          showBackButton
          onBackClick={() => alert("back")}
          left={<ChatHeaderTitle title="Back Enabled" />}
          right={
            <Button type="button" variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    );
  },
};
