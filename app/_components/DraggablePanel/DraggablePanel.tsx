"use client";

import { memo } from "react";

import type { DraggablePanelProps } from "./interface";

const DraggablePanel = memo<DraggablePanelProps>(
  ({ expand = true, destroyOnClose, className, style, children, ...rest }) => {
    if (!expand && destroyOnClose) return null;

    return (
      <aside
        className={className}
        style={{ ...style, display: expand ? style?.display : "none" }}
        {...rest}
      >
        {children}
      </aside>
    );
  },
);

DraggablePanel.displayName = "DraggablePanel";

export default DraggablePanel;
