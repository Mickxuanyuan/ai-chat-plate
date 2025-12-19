import { useState } from "react";

import {
  DraggablePanelBody,
  DraggablePanelContainer,
  DraggablePanelFooter,
  DraggablePanelHeader,
  DraggablePanelLayout,
} from "..";

export default () => {
  const [expand, setExpand] = useState(true);
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
            position="left"
            setExpand={setExpand}
            setPin={setPin}
            title="Header"
          />
          <DraggablePanelBody>DraggablePanel</DraggablePanelBody>
          <DraggablePanelFooter>Footer</DraggablePanelFooter>
        </DraggablePanelContainer>
      }
      panelProps={{
        expand,
        onExpandChange: setExpand,
        pin,
        placement: "left",
        showBorder: true,
        showHandleHighlight: true,
        showHandleWhenCollapsed: true,
      }}
      style={{ minHeight: 500 }}
      withHandle
    />
  );
};
