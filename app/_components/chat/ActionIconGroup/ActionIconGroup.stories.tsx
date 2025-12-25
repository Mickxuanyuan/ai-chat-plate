import type { Meta, StoryObj } from "@storybook/react";
import { Copy, Pencil, RotateCcw, Trash2 } from "lucide-react";

import ActionIconGroup from "./ActionIconGroup";
import type { ActionIconGroupProps } from "./interface";

const items: ActionIconGroupProps["items"] = [
  { key: "copy", label: "Copy", icon: Copy },
  { key: "edit", label: "Edit", icon: Pencil },
  { key: "regenerate", label: "Regenerate", icon: RotateCcw },
  { key: "delete", label: "Delete", icon: Trash2, danger: true },
];

// 菜单示例包含分隔线与危险项，覆盖常见“更多操作”场景。
const menu: ActionIconGroupProps["menu"] = {
  items: [
    { key: "copy", label: "Copy", icon: Copy },
    { key: "edit", label: "Edit", icon: Pencil },
    { type: "divider" },
    { key: "delete", label: "Delete", icon: Trash2, danger: true },
  ],
};

const meta: Meta<typeof ActionIconGroup> = {
  title: "app/chat/ActionIconGroup",
  component: ActionIconGroup,
  args: {
    disabled: false,
    glass: false,
    horizontal: true,
    shadow: false,
    size: "small",
    variant: "filled",
    items,
  },
};

export default meta;
type Story = StoryObj<typeof ActionIconGroup>;

export const Basic: Story = {
  render: (args) => (
    <div className="p-4">
      <ActionIconGroup
        {...args}
        onActionClick={(action) => console.log(action)}
      />
    </div>
  ),
};

export const WithMenu: Story = {
  render: (args) => (
    <div className="p-4">
      <ActionIconGroup
        {...args}
        menu={menu}
        onActionClick={(action) => console.log(action)}
      />
    </div>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <div className="p-4">
      <ActionIconGroup {...args} horizontal={false} />
    </div>
  ),
};

export const GlassShadow: Story = {
  render: (args) => (
    <div className="p-4">
      <ActionIconGroup {...args} glass shadow variant="outlined" size="normal" />
    </div>
  ),
};
