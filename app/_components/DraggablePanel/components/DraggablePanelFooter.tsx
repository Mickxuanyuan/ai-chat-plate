"use client";

import type { HTMLAttributes } from "react";
import { memo } from "react";

import { cn } from "@/utils/tools";

export type DraggablePanelFooterProps = HTMLAttributes<HTMLDivElement>;

const DraggablePanelFooter = memo<DraggablePanelFooterProps>(
  ({ className, ...rest }) => {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-start gap-2 border-t p-4",
          className,
        )}
        {...rest}
      />
    );
  },
);

DraggablePanelFooter.displayName = "DraggablePanelFooter";

export default DraggablePanelFooter;
