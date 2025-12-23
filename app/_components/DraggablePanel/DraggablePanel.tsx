"use client";

import { memo } from "react";

import { cn } from "@/utils/tools";

import type { DraggablePanelProps } from "./interface";

const DraggablePanel = memo<DraggablePanelProps>(
  ({ expand = true, destroyOnClose, className, children, ...rest }) => {
    if (!expand && destroyOnClose) return null;

    return (
      <aside className={cn(!expand && "hidden", className)} {...rest}>
        {children}
      </aside>
    );
  },
);

DraggablePanel.displayName = "DraggablePanel";

export default DraggablePanel;
