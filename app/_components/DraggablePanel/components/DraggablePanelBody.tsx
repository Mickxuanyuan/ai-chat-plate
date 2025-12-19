"use client";

import type { HTMLAttributes } from "react";
import { memo } from "react";

import { cn } from "@/utils/tools";

export type DraggablePanelBodyProps = HTMLAttributes<HTMLDivElement>;

const DraggablePanelBody = memo<DraggablePanelBodyProps>(
  ({ className, ...rest }) => {
    return (
      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden p-4 text-sm",
          className,
        )}
        {...rest}
      />
    );
  },
);

DraggablePanelBody.displayName = "DraggablePanelBody";

export default DraggablePanelBody;
