"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

import { Button } from "@/app/_components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/_components/ui/resizable";
import { cn } from "@/utils/tools";

import DraggablePanel from "../DraggablePanel";
import type { DraggablePanelProps } from "../interface";

export type DraggablePanelLayoutProps = {
  /**
   * 传给 DraggablePanel 的 props（children 由 `panel` 提供）。
   * - `mode` 会被固定为 `fixed`
   * - `resize` 会被固定为 `false`（缩放交给 Resizable）
   * - `sizing` 会被固定为 `external`
   */
  panelProps: Omit<
    DraggablePanelProps,
    "children" | "mode" | "resize" | "sizing"
  >;
  panel: ReactNode;
  content: ReactNode;
  defaultPanelSize?: number | string;
  minPanelSize?: number | string;
  maxPanelSize?: number | string;
  collapsedPanelSize?: number | string;
  withHandle?: boolean;
  className?: string;
  style?: CSSProperties;
};

const DraggablePanelLayout = memo<DraggablePanelLayoutProps>((props) => {
  const {
    panelProps,
    panel,
    content,
    defaultPanelSize,
    minPanelSize,
    maxPanelSize,
    collapsedPanelSize = 0,
    withHandle = true,
    className,
    style,
  } = props;

  const {
    placement,
    expand,
    defaultExpand = true,
    onExpandChange,
    ...restPanelProps
  } = panelProps;

  const [internalExpand, setInternalExpand] = useState(defaultExpand);
  const isExpand = expand ?? internalExpand;

  const setExpandState = useCallback(
    (next: boolean) => {
      if (expand === undefined) setInternalExpand(next);
      onExpandChange?.(next);
    },
    [expand, onExpandChange],
  );

  const panelRef = useRef<PanelImperativeHandle | null>(null);
  const lastExpandedSizeRef = useRef<number | string | undefined>(
    defaultPanelSize,
  );

  useEffect(() => {
    const api = panelRef.current;
    if (!api) return;

    if (!isExpand) {
      const current = api.getSize().asPercentage;
      if (current > 0.5) lastExpandedSizeRef.current = current;
      api.resize(collapsedPanelSize);
      return;
    }

    api.resize(lastExpandedSizeRef.current ?? defaultPanelSize ?? 25);
  }, [collapsedPanelSize, defaultPanelSize, isExpand]);

  const isHorizontal = placement === "left" || placement === "right";
  const orientation = isHorizontal ? "horizontal" : "vertical";
  const isPanelFirst = placement === "left" || placement === "top";

  const ArrowIcon = useMemo(() => {
    switch (placement) {
      case "top":
        return ChevronDown;
      case "bottom":
        return ChevronUp;
      case "right":
        return ChevronLeft;
      case "left":
        return ChevronRight;
    }
  }, [placement]);

  const collapsedToggle = useMemo(() => {
    if (isExpand) return null;

    const positionClassName = cn(
      placement === "left" && "left-0 top-1/2 -translate-y-1/2",
      placement === "right" && "right-0 top-1/2 -translate-y-1/2",
      placement === "top" && "top-0 left-1/2 -translate-x-1/2",
      placement === "bottom" && "bottom-0 left-1/2 -translate-x-1/2",
    );

    return (
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label="Expand panel"
        className={cn(
          "absolute z-20 rounded-md shadow-sm",
          "bg-background/80 backdrop-blur",
          "opacity-0 transition-opacity group-hover:opacity-100",
          positionClassName,
        )}
        onClick={() => setExpandState(true)}
      >
        <ArrowIcon className="size-4" />
      </Button>
    );
  }, [ArrowIcon, isExpand, placement, setExpandState]);

  const panelNode = (
    <ResizablePanel
      collapsedSize={collapsedPanelSize}
      collapsible
      defaultSize={defaultPanelSize}
      maxSize={maxPanelSize}
      minSize={minPanelSize}
      panelRef={panelRef}
    >
      <DraggablePanel
        {...restPanelProps}
        defaultExpand={defaultExpand}
        expand={isExpand}
        mode="fixed"
        onExpandChange={setExpandState}
        placement={placement}
        resize={false}
        sizing="external"
      >
        {panel}
      </DraggablePanel>
    </ResizablePanel>
  );

  const contentNode = <ResizablePanel>{content}</ResizablePanel>;

  return (
    <div
      className={cn("group relative h-full w-full", className)}
      style={style}
    >
      {collapsedToggle}
      <ResizablePanelGroup className="h-full w-full" orientation={orientation}>
        {isPanelFirst ? panelNode : contentNode}
        <ResizableHandle withHandle={withHandle} />
        {isPanelFirst ? contentNode : panelNode}
      </ResizablePanelGroup>
    </div>
  );
});

DraggablePanelLayout.displayName = "DraggablePanelLayout";

export default DraggablePanelLayout;
