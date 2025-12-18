/**
 * DraggablePanelHeader
 *
 * 面板头部区域（可选）：
 * - 提供「折叠」按钮（panel icon）
 * - 提供「Pin/Unpin」按钮（控制 hover 自动展开/折叠）
 *
 * 注意：这里的 `pin` 与 `expand` 都是由外部控制的（通过 props 回调），组件自身不持有业务状态。
 */
"use client";

import { PanelLeft, Pin, PinOff } from "lucide-react";
import type { HTMLAttributes } from "react";
import { memo, useState } from "react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/utils/tools";

export interface DraggablePanelHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * 是否处于 Pin 状态（受控）。
   * - Pin=true 时不会跟随 hover 自动折叠（由外部逻辑控制）
   */
  pin?: boolean;
  /**
   * 控制按钮位置：
   * - `left`: 左侧为折叠按钮，右侧为 pin
   * - `right`: 左侧为 pin，右侧为折叠按钮
   */
  position?: "left" | "right";
  /**
   * 通知父组件“展开/折叠”。
   * - Header 只负责触发，不持有 expand 状态
   */
  setExpand?: (expand: boolean) => void;
  /**
   * 通知父组件“Pin 状态变化”。
   * - 如果不传 `pin`（非受控），Header 会用内部状态驱动 UI，并同步回调
   */
  setPin?: (pin: boolean) => void;
  title?: string;
}

const DraggablePanelHeader = memo<DraggablePanelHeaderProps>((props) => {
  const {
    pin,
    setPin,
    className,
    setExpand,
    title,
    position = "left",
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
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2",
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
