import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import AvatarWithUpload from "./AvatarWithUpload";

const meta: Meta<typeof AvatarWithUpload> = {
  title: "app/AvatarWithUpload",
  component: AvatarWithUpload,
  args: {
    value: null,
    size: 40,
    disabled: false,
    accept: "image/*",
  },
};

export default meta;
type Story = StoryObj<typeof AvatarWithUpload>;

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(args.value ?? null);
    return (
      <div className="p-6">
        <AvatarWithUpload
          {...args}
          value={value}
          onChange={(next) => setValue(next)}
          onError={(e) => console.error(e)}
        />
        <div className="mt-3 text-xs text-muted-foreground">
          点击头像选择图片（base64）。
        </div>
      </div>
    );
  },
};

