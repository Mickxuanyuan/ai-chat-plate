"use client";

import { PanelLeft, Pin, PinOff } from "lucide-react";
import type { HTMLAttributes } from "react";
import { memo, useState } from "react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/utils/tools";

export interface DraggablePanelHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  pin?: boolean;
  position?: "left" | "right";
  setExpand?: (expand: boolean) => void;
  setPin?: (pin: boolean) => void;
  title?: string;
  /**
   * 是否作为拖拽手柄（配合 DraggablePanel 的 draggable 使用）。
   * @default true
   */
  dragHandle?: boolean;
}

const DraggablePanelHeader = memo<DraggablePanelHeaderProps>((props) => {
  const {
    pin,
    setPin,
    className,
    setExpand,
    title,
    position = "left",
    dragHandle = true,
    ...rest
  } = props;

  const [internalPinned, setInternalPinned] = useState(false);
  const isPinned = pin ?? internalPinned;

  const togglePin = () => {
    const next = !isPinned;
    setInternalPinned(next);
    setPin?.(next);
  };

  const collapseButton = (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Collapse panel"
      onClick={() => setExpand?.(false)}
    >
      <PanelLeft className="size-4" />
    </Button>
  );

  const pinButton = (
    <Button
      type="button"
      size="icon"
      variant={isPinned ? "secondary" : "ghost"}
      aria-label={isPinned ? "Unpin panel" : "Pin panel"}
      onClick={togglePin}
    >
      {isPinned ? <Pin className="size-4" /> : <PinOff className="size-4" />}
    </Button>
  );

  return (
    <div
      data-draggable-panel-handle={dragHandle ? "" : undefined}
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2",
        dragHandle && "cursor-move select-none touch-none",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-1">
        {position === "left" ? collapseButton : pinButton}
      </div>
      {title ? (
        <div className="min-w-0 flex-1 truncate text-sm font-medium">
          {title}
        </div>
      ) : (
        <div className="flex-1" />
      )}
      <div className="flex items-center gap-1">
        {position === "left" ? pinButton : collapseButton}
      </div>
    </div>
  );
});

DraggablePanelHeader.displayName = "DraggablePanelHeader";

export default DraggablePanelHeader;
