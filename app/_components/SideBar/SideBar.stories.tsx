import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar";
import { MessageSquare, Settings2, Sticker } from "lucide-react";

import SideBar from "./SideBar";

const meta: Meta<typeof SideBar> = {
  title: "app/SideBar",
  component: SideBar,
  args: {
    items: [
      { key: "chat", label: "Chat", icon: MessageSquare },
      { key: "market", label: "Market", icon: Sticker },
    ],
    activeKey: "chat",
    avatar: (
      <Avatar>
        <AvatarFallback className="text-xs font-semibold">AI</AvatarFallback>
      </Avatar>
    ),
    onTabChange: () => {},
    bottomActions: [{ label: "Settings", icon: Settings2, onClick: () => {} }],
  },
};

export default meta;
type Story = StoryObj<typeof SideBar>;

export const Basic: Story = {
  render: (args) => {
    const items = useMemo(
      () => [
        { key: "chat", label: "Chat", icon: MessageSquare },
        { key: "market", label: "Market", icon: Sticker },
        { key: "disabled", label: "Disabled", icon: Sticker, disabled: true },
      ],
      [],
    );

    const [activeKey, setActiveKey] = useState<string>(args.activeKey);

    return (
      <div className="flex h-[520px] w-full">
        <SideBar
          {...args}
          items={items}
          activeKey={activeKey}
          onTabChange={(key) => setActiveKey(key)}
          bottomActions={[
            {
              label: "Settings",
              icon: Settings2,
              onClick: () => alert("Settings clicked"),
            },
          ]}
        />

        <div className="flex flex-1 flex-col gap-2 p-6">
          <div className="text-sm font-medium">Active tab:</div>
          <div className="rounded-md border bg-background px-3 py-2 text-sm">
            {activeKey}
          </div>
          <div className="text-xs text-muted-foreground">
            点击侧边栏按钮观察 activeKey 变化（disabled 项不可点击）。
          </div>
        </div>
      </div>
    );
  },
};
