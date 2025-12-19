import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/app/_components/ui/button";

import DraggablePanel, {
  DraggablePanelBody,
  DraggablePanelContainer,
  DraggablePanelFooter,
  DraggablePanelHeader,
  DraggablePanelLayout,
} from "./index";

const meta: Meta<typeof DraggablePanel> = {
  title: "app/DraggablePanel",
  component: DraggablePanel,
  args: {
    placement: "left",
    pin: true,
    expandable: true,
    showBorder: true,
    showHandleHighlight: true,
    showHandleWhenCollapsed: true,
    destroyOnClose: false,
    headerHeight: 0,
    minWidth: 180,
    maxWidth: 520,
    minHeight: 120,
    maxHeight: 520,
  },
};

export default meta;
type Story = StoryObj<typeof DraggablePanel>;

export const Docked: Story = {
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
        style={{ height: 520 }}
      >
        <DraggablePanel
          {...args}
          expand={expand}
          mode={pin ? "fixed" : "float"}
          onExpandChange={setExpand}
          pin={pin}
        >
          <DraggablePanelContainer className="flex h-full flex-col">
            <DraggablePanelHeader
              pin={pin}
              position="left"
              setExpand={setExpand}
              setPin={setPin}
              title="Sessions"
            />
            <DraggablePanelBody>
              {pin ? "Pinned（不会 hover 折叠）" : "Hover（移出后延迟折叠）"}
            </DraggablePanelBody>
            <DraggablePanelFooter>Footer</DraggablePanelFooter>
          </DraggablePanelContainer>
        </DraggablePanel>

        <div className="flex-1 p-6">
          <div className="text-sm font-medium">Content</div>
          <div className="mt-2 text-xs text-muted-foreground">
            试试拖动边缘缩放面板；点击边缘 handle 折叠/展开；Pin 切换 hover
            自动展开。
          </div>
        </div>
      </div>
    );
  },
};

export const ResizableLayout: Story = {
  render: () => {
    const [expand, setExpand] = useState(true);
    const [pin, setPin] = useState(true);

    const panelProps = useMemo(
      () => ({
        defaultExpand: true,
        expand,
        onExpandChange: setExpand,
        pin,
        placement: "left" as const,
        showBorder: true,
        showHandleHighlight: true,
        showHandleWhenCollapsed: true,
      }),
      [expand, pin],
    );

    return (
      <div className="h-[520px] w-full">
        <DraggablePanelLayout
          content={<div className="h-full w-full p-6">Content</div>}
          defaultPanelSize={25}
          maxPanelSize={60}
          minPanelSize={15}
          panel={
            <DraggablePanelContainer className="flex h-full flex-col">
              <DraggablePanelHeader
                pin={pin}
                setExpand={setExpand}
                setPin={setPin}
                title="Resizable Layout"
              />
              <DraggablePanelBody>
                这里的缩放由 shadcn `ResizablePanelGroup`
                提供（拖动中间分割条）。
              </DraggablePanelBody>
              <DraggablePanelFooter>Footer</DraggablePanelFooter>
            </DraggablePanelContainer>
          }
          panelProps={panelProps}
          withHandle
        />
      </div>
    );
  },
};

export const LobeHubLike: Story = {
  render: () => {
    return (
      <div className="h-[640px] w-full">
        <DraggablePanelLayout
          content={
            <div className="flex h-full w-full flex-col p-6">
              <div className="text-sm font-medium">Main Content</div>
              <div className="mt-2 text-xs text-muted-foreground">
                这个 story 用来模拟 LobeHub
                左侧面板的结构与交互（拖动分割条缩放， hover 显示展开按钮）。
              </div>
            </div>
          }
          defaultPanelSize={26}
          maxPanelSize={60}
          minPanelSize={18}
          panel={
            <DraggablePanelContainer className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-2xl font-semibold tracking-tight">
                  LobeHub
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  aria-label="New session"
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="px-4 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="搜索助手和对话..."
                  />
                </div>
              </div>

              <DraggablePanelBody className="p-0">
                <div className="h-full w-full" />
              </DraggablePanelBody>
            </DraggablePanelContainer>
          }
          panelProps={{
            defaultExpand: true,
            placement: "left",
            showBorder: true,
            showHandleHighlight: false,
            showHandleWhenCollapsed: true,
            pin: true,
          }}
          withHandle={false}
        />
      </div>
    );
  },
};
