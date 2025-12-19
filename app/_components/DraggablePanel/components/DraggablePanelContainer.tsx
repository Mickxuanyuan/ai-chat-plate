"use client";

import type { HTMLAttributes } from "react";
import { memo } from "react";

import { cn } from "@/utils/tools";

export type DraggablePanelContainerProps = HTMLAttributes<HTMLDivElement>;

const DraggablePanelContainer = memo<DraggablePanelContainerProps>(
  ({ className, ...rest }) => {
    return (
      <div className={cn("relative overflow-hidden", className)} {...rest} />
    );
  },
);

DraggablePanelContainer.displayName = "DraggablePanelContainer";

export default DraggablePanelContainer;
