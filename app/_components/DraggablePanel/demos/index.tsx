import { useState } from "react";

import {
  DraggablePanelBody,
  DraggablePanelContainer,
  DraggablePanelHeader,
  DraggablePanelLayout,
} from "..";

export default () => {
  const [pin, setPin] = useState(true);

  return (
    <DraggablePanelLayout
      className="h-full w-full"
      content={<div className="h-full w-full p-6">Content</div>}
      defaultPanelSize={25}
      maxPanelSize={60}
      minPanelSize={15}
      panel={
        <DraggablePanelContainer className="flex h-full flex-col">
          <DraggablePanelHeader
            pin={pin}
            setPin={setPin}
            title="Draggable Panel"
          />
          <DraggablePanelBody>
            默认使用 shadcn 的 `ResizablePanelGroup` 进行缩放；点击 Header
            左侧按钮折叠，折叠后可点击边缘按钮打开。
          </DraggablePanelBody>
        </DraggablePanelContainer>
      }
      panelProps={{
        defaultExpand: true,
        pin,
        placement: "left",
        showBorder: true,
        showHandleHighlight: true,
      }}
      style={{ minHeight: 500 }}
      withHandle
    />
  );
};
