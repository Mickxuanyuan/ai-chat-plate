"use client";

import { PanelLeft } from "lucide-react";
import type { HTMLAttributes } from "react";
import { memo } from "react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/utils/tools";

export interface DraggablePanelHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  setExpand?: (expand: boolean) => void;
  title?: string;
}

const DraggablePanelHeader = memo<DraggablePanelHeaderProps>((props) => {
  const { className, setExpand, title, ...rest } = props;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Collapse panel"
          onClick={() => setExpand?.(false)}
        >
          <PanelLeft className="size-4" />
        </Button>
      </div>

      {title ? (
        <div className="min-w-0 flex-1 truncate text-sm font-medium">
          {title}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div className="w-8" aria-hidden="true" />
    </div>
  );
});

DraggablePanelHeader.displayName = "DraggablePanelHeader";

export default DraggablePanelHeader;
