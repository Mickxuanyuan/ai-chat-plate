import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import DraggablePanel, {
  DraggablePanelBody,
  DraggablePanelContainer,
  DraggablePanelFooter,
  DraggablePanelHeader,
} from "./index";

const meta: Meta<typeof DraggablePanel> = {
  title: "app/DraggablePanel",
  component: DraggablePanel,
  args: {
    placement: "left",
    pin: true,
    expandable: true,
    showBorder: true,
    showHandleHighlight: false,
    showHandleWhenCollapsed: false,
    destroyOnClose: false,
    headerHeight: 0,
    minWidth: 180,
    minHeight: 0,
  },
};

export default meta;
type Story = StoryObj<typeof DraggablePanel>;

export const Basic: Story = {
  render: (args) => {
    const [expand, setExpand] = useState(true);
    const [pin, setPin] = useState(Boolean(args.pin));

    const isHorizontal =
      args.placement === "left" || args.placement === "right";

    return (
      <div
        className={[
          "relative flex h-full w-full",
          isHorizontal ? "flex-row" : "flex-col",
        ].join(" ")}
        style={{ minHeight: 500 }}
      >
        <DraggablePanel
          {...args}
          expand={expand}
          mode={pin ? "fixed" : "float"}
          onExpandChange={setExpand}
          pin={pin}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <DraggablePanelContainer style={{ flex: 1 }}>
            <DraggablePanelHeader
              pin={pin}
              position="left"
              setExpand={setExpand}
              setPin={setPin}
              title="Sessions"
            />
            <DraggablePanelBody>Panel Content</DraggablePanelBody>
            <DraggablePanelFooter>Footer</DraggablePanelFooter>
          </DraggablePanelContainer>
        </DraggablePanel>

        <div style={{ flex: 1, padding: 24 }}>Content</div>
      </div>
    );
  },
};
