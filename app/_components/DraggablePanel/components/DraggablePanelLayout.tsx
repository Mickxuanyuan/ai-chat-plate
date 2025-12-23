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
import type { DraggablePanelLayoutPanelProps } from "../interface";

export type DraggablePanelLayoutProps = {
  /**
   * 传给 DraggablePanel 的 props（children 由 `panel` 提供）。
   */
  panelProps: DraggablePanelLayoutPanelProps;
  panel: ReactNode;
  content: ReactNode;
  defaultPanelSize?: number | string;
  minPanelSize?: number | string;
  maxPanelSize?: number | string;
  collapsedPanelSize?: number | string;
  withHandle?: boolean;
  withCollapseButton?: boolean;
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
    withCollapseButton = true,
    className,
    style,
  } = props;

  const {
    placement,
    expand,
    defaultExpand = true,
    onExpandChange,
    destroyOnClose,
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
  const lastExpandedSizeRef = useRef<string | undefined>(undefined);

  const toPercentageString = useCallback((value: number | string) => {
    if (typeof value === "number") return `${value}%`;
    return value;
  }, []);

  const resolvedCollapsedPanelSize = useMemo(
    () => toPercentageString(collapsedPanelSize),
    [collapsedPanelSize, toPercentageString],
  );
  const resolvedDefaultPanelSize = useMemo(
    () => toPercentageString(defaultPanelSize ?? 25),
    [defaultPanelSize, toPercentageString],
  );
  const resolvedMinPanelSize = useMemo(
    () =>
      minPanelSize === undefined ? undefined : toPercentageString(minPanelSize),
    [minPanelSize, toPercentageString],
  );
  const resolvedMaxPanelSize = useMemo(
    () =>
      maxPanelSize === undefined ? undefined : toPercentageString(maxPanelSize),
    [maxPanelSize, toPercentageString],
  );

  useEffect(() => {
    const api = panelRef.current;
    if (!api) return;

    const raf = window.requestAnimationFrame(() => {
      try {
        if (!isExpand) {
          const current = api.getSize().asPercentage;
          if (current > 0.5) lastExpandedSizeRef.current = `${current}%`;
          api.resize(resolvedCollapsedPanelSize);
          return;
        }

        api.resize(lastExpandedSizeRef.current ?? resolvedDefaultPanelSize);
      } catch {
        // Storybook/HMR/StrictMode 下可能出现 group 尚未挂载或已卸载的瞬间，忽略即可。
      }
    });

    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, [isExpand, resolvedCollapsedPanelSize, resolvedDefaultPanelSize]);

  const isHorizontal = placement === "left" || placement === "right";
  const orientation = isHorizontal ? "horizontal" : "vertical";
  const isPanelFirst = placement === "left" || placement === "top";

  const [isHoverPanel, setIsHoverPanel] = useState(false);
  const [isHoverHandle, setIsHoverHandle] = useState(false);

  const panelBorderClassName = useMemo(() => {
    if (!isExpand) return "";
    if (placement === "left") return "border-r";
    if (placement === "right") return "border-l";
    if (placement === "top") return "border-b";
    return "border-t";
  }, [isExpand, placement]);

  const ToggleIcon = useMemo(() => {
    if (isExpand) {
      switch (placement) {
        case "left":
          return ChevronLeft;
        case "right":
          return ChevronRight;
        case "top":
          return ChevronUp;
        case "bottom":
          return ChevronDown;
      }
    }

    switch (placement) {
      case "left":
        return ChevronRight;
      case "right":
        return ChevronLeft;
      case "top":
        return ChevronDown;
      case "bottom":
        return ChevronUp;
    }
  }, [isExpand, placement]);

  const shouldShowToggle = withCollapseButton
    ? isExpand
      ? isHoverPanel || isHoverHandle
      : isHoverHandle
    : false;

  const panelNode = (
    <ResizablePanel
      collapsedSize={resolvedCollapsedPanelSize}
      collapsible
      defaultSize={resolvedDefaultPanelSize}
      maxSize={resolvedMaxPanelSize}
      minSize={resolvedMinPanelSize}
      panelRef={panelRef}
    >
      <DraggablePanel
        className={cn("h-full w-full border-border", panelBorderClassName)}
        expand={isExpand}
        destroyOnClose={destroyOnClose}
      >
        <div
          className="h-full w-full"
          onPointerEnter={() => setIsHoverPanel(true)}
          onPointerLeave={() => setIsHoverPanel(false)}
        >
          {panel}
        </div>
      </DraggablePanel>
    </ResizablePanel>
  );

  const contentNode = <ResizablePanel>{content}</ResizablePanel>;

  return (
    <div
      className={cn("group relative h-full w-full", className)}
      style={style}
    >
      <ResizablePanelGroup className="h-full w-full" orientation={orientation}>
        {isPanelFirst ? panelNode : contentNode}
        <ResizableHandle
          withHandle={withHandle}
          className={cn(withCollapseButton && "relative")}
          onPointerEnter={() => setIsHoverHandle(true)}
          onPointerLeave={() => setIsHoverHandle(false)}
        >
          {withCollapseButton && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label={isExpand ? "Collapse panel" : "Expand panel"}
              className={cn(
                "absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md",
                "bg-background/90 backdrop-blur",
                "ring-1 ring-border/60",
                "hover:bg-background",
                "opacity-0 transition-opacity",
                shouldShowToggle && "opacity-100",
              )}
              onClick={() => setExpandState(!isExpand)}
            >
              <ToggleIcon className="size-4" />
            </Button>
          )}
        </ResizableHandle>
        {isPanelFirst ? contentNode : panelNode}
      </ResizablePanelGroup>
    </div>
  );
});

DraggablePanelLayout.displayName = "DraggablePanelLayout";

export default DraggablePanelLayout;
