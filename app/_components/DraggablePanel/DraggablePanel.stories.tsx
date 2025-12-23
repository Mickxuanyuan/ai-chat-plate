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
    destroyOnClose: false,
  },
};

export default meta;
type Story = StoryObj<typeof DraggablePanel>;

export const ClickToggle: Story = {
  render: () => {
    const [expand, setExpand] = useState(true);

    return (
      <div className="h-[520px] w-full">
        <DraggablePanelLayout
          content={
            <div className="h-full w-full p-6 text-sm text-muted-foreground">
              点击面板 Header 的按钮可折叠；折叠后点击边缘按钮可展开。
            </div>
          }
          defaultPanelSize={25}
          maxPanelSize={60}
          minPanelSize={15}
          panel={
            <DraggablePanelContainer className="flex h-full flex-col">
              <DraggablePanelHeader setExpand={setExpand} title="Panel" />
              <DraggablePanelBody>点击左上角按钮折叠面板</DraggablePanelBody>
              <DraggablePanelFooter>Footer</DraggablePanelFooter>
            </DraggablePanelContainer>
          }
          panelProps={{
            defaultExpand: true,
            expand,
            onExpandChange: setExpand,
            placement: "left",
            destroyOnClose: false,
          }}
          withHandle
        />
      </div>
    );
  },
};

export const ResizableLayout: Story = {
  render: () => {
    const [expand, setExpand] = useState(true);

    const panelProps = useMemo(
      () => ({
        defaultExpand: true,
        expand,
        onExpandChange: setExpand,
        placement: "left" as const,
        destroyOnClose: false,
      }),
      [expand],
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
                setExpand={setExpand}
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
            destroyOnClose: false,
          }}
          withHandle={false}
        />
      </div>
    );
  },
};
