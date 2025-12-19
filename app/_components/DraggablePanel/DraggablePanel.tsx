"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  X,
} from "lucide-react";
import type { CSSProperties } from "react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/utils/tools";

import {
  clampNumber,
  getDocumentDir,
  isInteractiveTarget,
  reversePlacement,
  toPxNumber,
} from "./helpers";
import type {
  DraggablePanelDelta,
  DraggablePanelPosition,
  DraggablePanelPositionDelta,
  DraggablePanelProps,
  DraggablePanelSize,
} from "./interface";

const DEFAULT_HEIGHT = 180;
const DEFAULT_WIDTH = 280;
const DEFAULT_HEADER_HEIGHT = 0;
const DEFAULT_PIN = true;
const DEFAULT_MODE = "fixed";
const DEFAULT_EXPANDABLE = true;
const DEFAULT_EXPAND = true;
const DEFAULT_SHOW_HANDLE_WIDE_AREA = true;
const DEFAULT_FLOAT_POSITION: DraggablePanelPosition = { x: 16, y: 16 };
const DEFAULT_COLLAPSED_FLOAT_SIZE = 44;

function isResizeEnabled(
  resize: DraggablePanelProps["resize"],
  edge: "top" | "right" | "bottom" | "left",
) {
  if (resize === false) return false;
  if (resize === true || resize === undefined) return true;
  return resize[edge] !== false;
}

const DraggablePanel = memo<DraggablePanelProps>((props) => {
  const {
    placement,
    mode = DEFAULT_MODE,
    pin = DEFAULT_PIN,
    headerHeight = DEFAULT_HEADER_HEIGHT,
    fullscreen,
    expandable = DEFAULT_EXPANDABLE,
    expand,
    defaultExpand = DEFAULT_EXPAND,
    onExpandChange,
    destroyOnClose,
    showHandleWhenCollapsed = true,
    showHandleWideArea = DEFAULT_SHOW_HANDLE_WIDE_AREA,
    showHandleHighlight,
    showBorder = true,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    resize,
    size,
    defaultSize,
    onSizeChange,
    onSizeDragging,
    draggable = false,
    dragHandleSelector = "[data-draggable-panel-handle]",
    position,
    defaultPosition,
    onPositionChange,
    onPositionDragging,
    classNames,
    styles,
    className,
    style,
    backgroundColor,
    dir,
    sizing = "internal",
    children,
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const [internalExpand, setInternalExpand] = useState(defaultExpand);
  const isExpand = expand ?? internalExpand;

  const setExpandState = useCallback(
    (next: boolean) => {
      if (!expandable) return;
      if (expand === undefined) setInternalExpand(next);
      onExpandChange?.(next);
    },
    [expand, expandable, onExpandChange],
  );

  const direction = dir ?? getDocumentDir();
  const internalPlacement = useMemo(() => {
    if (direction !== "rtl") return placement;
    if (placement === "left") return "right";
    if (placement === "right") return "left";
    return placement;
  }, [direction, placement]);

  const isVertical =
    internalPlacement === "top" || internalPlacement === "bottom";
  const resizeEdge = reversePlacement(internalPlacement);
  const isDraggable = mode === "float" && draggable;
  const isExternalSizing = sizing === "external";

  const [internalSize, setInternalSize] = useState<DraggablePanelSize>(() => {
    if (isDraggable) {
      return {
        height: defaultSize?.height ?? DEFAULT_HEIGHT,
        width: defaultSize?.width ?? DEFAULT_WIDTH,
      };
    }

    if (isVertical) {
      return { height: defaultSize?.height ?? DEFAULT_HEIGHT, width: "100%" };
    }
    return { height: "100%", width: defaultSize?.width ?? DEFAULT_WIDTH };
  });
  const resolvedSize = { ...internalSize, ...size };

  const [internalPosition, setInternalPosition] =
    useState<DraggablePanelPosition>(() => {
      const base = defaultPosition ?? DEFAULT_FLOAT_POSITION;
      return {
        x: base.x,
        y: Math.max(0, headerHeight) + base.y,
      };
    });
  const resolvedPosition = position ?? internalPosition;

  const applyResize = useCallback(
    (
      next: DraggablePanelSize,
      delta: DraggablePanelDelta,
      isFinal: boolean,
    ) => {
      if (size === undefined) setInternalSize(next);
      if (isFinal) onSizeChange?.(delta, next);
      else onSizeDragging?.(delta, next);
    },
    [onSizeChange, onSizeDragging, size],
  );

  const applyPosition = useCallback(
    (
      next: DraggablePanelPosition,
      delta: DraggablePanelPositionDelta,
      isFinal: boolean,
    ) => {
      if (position === undefined) setInternalPosition(next);
      if (isFinal) onPositionChange?.(delta, next);
      else onPositionDragging?.(delta, next);
    },
    [onPositionChange, onPositionDragging, position],
  );

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const onMouseEnter = useCallback(() => {
    if (pin) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (!isExpand) startTransition(() => setExpandState(true));
  }, [isExpand, pin, setExpandState]);

  const onMouseLeave = useCallback(() => {
    if (pin) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      startTransition(() => setExpandState(false));
    }, 150);
  }, [pin, setExpandState]);

  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startSize: DraggablePanelSize;
  } | null>(null);

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isExpand) return;
      if (!isResizeEnabled(resize, resizeEdge)) return;

      setIsResizing(true);
      resizeStartRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startSize: {
          width: resolvedSize.width,
          height: resolvedSize.height,
        },
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [isExpand, resize, resizeEdge, resolvedSize.height, resolvedSize.width],
  );

  const onResizeCornerPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggable) return;
      if (!isExpand) return;
      if (resize === false) return;

      setIsResizing(true);
      resizeStartRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startSize: {
          width: resolvedSize.width,
          height: resolvedSize.height,
        },
      };
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [isDraggable, isExpand, resize, resolvedSize.height, resolvedSize.width],
  );

  const onResizePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = resizeStartRef.current;
      if (!start) return;
      if (e.pointerId !== start.pointerId) return;

      const dx = e.clientX - start.startClientX;
      const dy = e.clientY - start.startClientY;

      const next: DraggablePanelSize = { ...start.startSize };
      const delta: DraggablePanelDelta = {};

      if (!isVertical) {
        const startWidth = toPxNumber(start.startSize.width, DEFAULT_WIDTH);
        const rawDelta =
          internalPlacement === "left"
            ? dx
            : internalPlacement === "right"
              ? -dx
              : dx;
        const nextWidth = clampNumber(
          startWidth + rawDelta,
          minWidth,
          maxWidth,
        );
        next.width = nextWidth;
        next.height = "100%";
        delta.width = nextWidth - startWidth;
      } else {
        const startHeight = toPxNumber(start.startSize.height, DEFAULT_HEIGHT);
        const rawDelta =
          internalPlacement === "top"
            ? dy
            : internalPlacement === "bottom"
              ? -dy
              : dy;
        const nextHeight = clampNumber(
          startHeight + rawDelta,
          minHeight,
          maxHeight,
        );
        next.height = nextHeight;
        next.width = "100%";
        delta.height = nextHeight - startHeight;
      }

      applyResize(next, delta, false);
    },
    [
      applyResize,
      internalPlacement,
      isVertical,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
    ],
  );

  const onResizeCornerPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = resizeStartRef.current;
      if (!start) return;
      if (e.pointerId !== start.pointerId) return;

      const dx = e.clientX - start.startClientX;
      const dy = e.clientY - start.startClientY;

      const startWidth = toPxNumber(start.startSize.width, DEFAULT_WIDTH);
      const startHeight = toPxNumber(start.startSize.height, DEFAULT_HEIGHT);
      const nextWidth = clampNumber(startWidth + dx, minWidth, maxWidth);
      const nextHeight = clampNumber(startHeight + dy, minHeight, maxHeight);

      applyResize(
        { height: nextHeight, width: nextWidth },
        { height: nextHeight - startHeight, width: nextWidth - startWidth },
        false,
      );
    },
    [applyResize, maxHeight, maxWidth, minHeight, minWidth],
  );

  const onResizePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = resizeStartRef.current;
      if (!start) return;
      if (e.pointerId !== start.pointerId) return;

      const dx = e.clientX - start.startClientX;
      const dy = e.clientY - start.startClientY;

      const next: DraggablePanelSize = { ...start.startSize };
      const delta: DraggablePanelDelta = {};

      if (!isVertical) {
        const startWidth = toPxNumber(start.startSize.width, DEFAULT_WIDTH);
        const rawDelta =
          internalPlacement === "left"
            ? dx
            : internalPlacement === "right"
              ? -dx
              : dx;
        const nextWidth = clampNumber(
          startWidth + rawDelta,
          minWidth,
          maxWidth,
        );
        next.width = nextWidth;
        next.height = "100%";
        delta.width = nextWidth - startWidth;
      } else {
        const startHeight = toPxNumber(start.startSize.height, DEFAULT_HEIGHT);
        const rawDelta =
          internalPlacement === "top"
            ? dy
            : internalPlacement === "bottom"
              ? -dy
              : dy;
        const nextHeight = clampNumber(
          startHeight + rawDelta,
          minHeight,
          maxHeight,
        );
        next.height = nextHeight;
        next.width = "100%";
        delta.height = nextHeight - startHeight;
      }

      applyResize(next, delta, true);

      setIsResizing(false);
      resizeStartRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    },
    [
      applyResize,
      internalPlacement,
      isVertical,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
    ],
  );

  const onResizeCornerPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = resizeStartRef.current;
      if (!start) return;
      if (e.pointerId !== start.pointerId) return;

      const dx = e.clientX - start.startClientX;
      const dy = e.clientY - start.startClientY;

      const startWidth = toPxNumber(start.startSize.width, DEFAULT_WIDTH);
      const startHeight = toPxNumber(start.startSize.height, DEFAULT_HEIGHT);
      const nextWidth = clampNumber(startWidth + dx, minWidth, maxWidth);
      const nextHeight = clampNumber(startHeight + dy, minHeight, maxHeight);

      applyResize(
        { height: nextHeight, width: nextWidth },
        { height: nextHeight - startHeight, width: nextWidth - startWidth },
        true,
      );

      setIsResizing(false);
      resizeStartRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    },
    [applyResize, maxHeight, maxWidth, minHeight, minWidth],
  );

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPosition: DraggablePanelPosition;
  } | null>(null);

  const clampPositionToOffsetParent = useCallback(
    (next: DraggablePanelPosition) => {
      const node = rootRef.current;
      const parent = node?.offsetParent as HTMLElement | null;
      if (!node || !parent) return next;

      const maxX = Math.max(0, parent.clientWidth - node.offsetWidth);
      const maxY = Math.max(0, parent.clientHeight - node.offsetHeight);
      return {
        x: clampNumber(next.x, 0, maxX),
        y: clampNumber(next.y, 0, maxY),
      };
    },
    [],
  );

  const onDragPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!isDraggable) return;
      if (!isExpand) return;
      if (e.button !== 0) return;

      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-draggable-panel-resize]")) return;
      if (dragHandleSelector && !target.closest(dragHandleSelector)) return;
      if (isInteractiveTarget(target)) return;

      setIsDragging(true);
      dragStartRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startPosition: resolvedPosition,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
    },
    [dragHandleSelector, isDraggable, isExpand, resolvedPosition],
  );

  const onDragPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const start = dragStartRef.current;
      if (!start) return;
      if (e.pointerId !== start.pointerId) return;

      const dx = e.clientX - start.startClientX;
      const dy = e.clientY - start.startClientY;
      const rawNext = {
        x: start.startPosition.x + dx,
        y: start.startPosition.y + dy,
      };
      const next = clampPositionToOffsetParent(rawNext);
      applyPosition(
        next,
        {
          x: next.x - start.startPosition.x,
          y: next.y - start.startPosition.y,
        },
        false,
      );
    },
    [applyPosition, clampPositionToOffsetParent],
  );

  const onDragPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const start = dragStartRef.current;
      if (!start) return;
      if (e.pointerId !== start.pointerId) return;

      const dx = e.clientX - start.startClientX;
      const dy = e.clientY - start.startClientY;
      const rawNext = {
        x: start.startPosition.x + dx,
        y: start.startPosition.y + dy,
      };
      const next = clampPositionToOffsetParent(rawNext);
      applyPosition(
        next,
        {
          x: next.x - start.startPosition.x,
          y: next.y - start.startPosition.y,
        },
        true,
      );

      setIsDragging(false);
      dragStartRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    },
    [applyPosition, clampPositionToOffsetParent],
  );

  const ArrowIcon = useMemo(() => {
    switch (internalPlacement) {
      case "top":
        return ChevronDown;
      case "bottom":
        return ChevronUp;
      case "right":
        return ChevronLeft;
      case "left":
        return ChevronRight;
    }
  }, [internalPlacement]);

  const toggle = useMemo(() => {
    if (isDraggable) return null;
    if (!expandable) return null;
    if (isResizing) return null;
    if (!isExpand && !showHandleWhenCollapsed) return null;

    const isHorizontal =
      internalPlacement === "left" || internalPlacement === "right";

    const wrapperClassName = cn(
      "absolute z-10 opacity-0 transition-opacity",
      "group-hover:opacity-100",
      "flex",
      showHandleWideArea ? "pointer-events-auto" : "pointer-events-none",
      isHorizontal && "inset-y-0 w-4 items-center",
      internalPlacement === "left" && "right-[-16px] justify-end",
      internalPlacement === "right" && "left-[-16px] justify-start",
      !isHorizontal && "inset-x-0 h-4 flex-col items-center",
      internalPlacement === "top" && "bottom-[-16px] justify-end",
      internalPlacement === "bottom" && "top-[-16px] justify-start",
    );

    const buttonClassName = cn(
      "pointer-events-auto flex items-center justify-center border text-muted-foreground shadow-sm transition-colors hover:text-foreground",
      "bg-background/80 backdrop-blur",
      internalPlacement === "left" &&
        "h-4 w-[54px] rounded-b-lg rounded-t-lg border-l-0",
      internalPlacement === "right" &&
        "h-4 w-[54px] rounded-b-lg rounded-t-lg border-r-0",
      internalPlacement === "top" && "h-4 w-[54px] rounded-t-lg border-b-0",
      internalPlacement === "bottom" && "h-4 w-[54px] rounded-b-lg border-t-0",
    );

    return (
      <div className={wrapperClassName}>
        <button
          type="button"
          className={cn(buttonClassName, classNames?.handle)}
          aria-label={isExpand ? "Collapse panel" : "Expand panel"}
          onClick={() => startTransition(() => setExpandState(!isExpand))}
          style={{
            backgroundColor,
            ...styles?.handle,
          }}
        >
          <ArrowIcon
            className={cn(
              "size-4 transition-transform",
              isExpand ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
      </div>
    );
  }, [
    ArrowIcon,
    backgroundColor,
    classNames?.handle,
    expandable,
    internalPlacement,
    isDraggable,
    isExpand,
    isResizing,
    setExpandState,
    showHandleWhenCollapsed,
    showHandleWideArea,
    styles?.handle,
  ]);

  const positionStyle: CSSProperties = useMemo(() => {
    if (mode !== "float") return {};

    if (isDraggable) {
      return {
        left: resolvedPosition.x,
        position: "absolute",
        top: resolvedPosition.y,
      };
    }

    if (internalPlacement === "left") {
      return { bottom: 0, left: 0, position: "absolute", top: headerHeight };
    }
    if (internalPlacement === "right") {
      return { bottom: 0, position: "absolute", right: 0, top: headerHeight };
    }
    if (internalPlacement === "top") {
      return { left: 0, position: "absolute", right: 0, top: headerHeight };
    }
    return { bottom: 0, left: 0, position: "absolute", right: 0 };
  }, [
    headerHeight,
    internalPlacement,
    isDraggable,
    mode,
    resolvedPosition.x,
    resolvedPosition.y,
  ]);

  const sizeStyle: CSSProperties = useMemo(() => {
    if (isExternalSizing) return { height: "100%", width: "100%" };

    if (!isExpand) {
      if (isDraggable) {
        return {
          height: DEFAULT_COLLAPSED_FLOAT_SIZE,
          width: DEFAULT_COLLAPSED_FLOAT_SIZE,
        };
      }
      return isVertical
        ? { height: 0, width: "100%" }
        : { height: "100%", width: 0 };
    }

    if (isDraggable) {
      return {
        height: toPxNumber(resolvedSize.height, DEFAULT_HEIGHT),
        width: toPxNumber(resolvedSize.width, DEFAULT_WIDTH),
      };
    }

    if (isVertical) {
      return {
        height: toPxNumber(resolvedSize.height, DEFAULT_HEIGHT),
        width: "100%",
      };
    }
    return {
      height: "100%",
      width: toPxNumber(resolvedSize.width, DEFAULT_WIDTH),
    };
  }, [
    isExternalSizing,
    isDraggable,
    isExpand,
    isVertical,
    resolvedSize.height,
    resolvedSize.width,
  ]);

  const borderClassName = useMemo(() => {
    if (!showBorder || !isExpand) return "";
    if (internalPlacement === "left") return "border-r";
    if (internalPlacement === "right") return "border-l";
    if (internalPlacement === "top") return "border-b";
    return "border-t";
  }, [internalPlacement, isExpand, showBorder]);

  const canResize =
    !isExternalSizing &&
    isExpand &&
    (isDraggable ? resize !== false : isResizeEnabled(resize, resizeEdge));
  const resizeBar = useMemo(() => {
    if (!canResize) return null;
    if (isDraggable) return null;

    const isHorizontal =
      internalPlacement === "left" || internalPlacement === "right";

    return (
      <div
        aria-hidden="true"
        data-draggable-panel-resize=""
        className={cn(
          "absolute z-20 bg-transparent",
          isHorizontal
            ? "inset-y-0 w-1 cursor-ew-resize"
            : "inset-x-0 h-1 cursor-ns-resize",
          internalPlacement === "left" && "right-0",
          internalPlacement === "right" && "left-0",
          internalPlacement === "top" && "bottom-0",
          internalPlacement === "bottom" && "top-0",
          showHandleHighlight && "hover:bg-primary/30 active:bg-primary/40",
        )}
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
      />
    );
  }, [
    canResize,
    internalPlacement,
    isDraggable,
    onResizePointerDown,
    onResizePointerMove,
    onResizePointerUp,
    showHandleHighlight,
  ]);

  const resizeCorner = useMemo(() => {
    if (!canResize) return null;
    if (!isDraggable) return null;

    return (
      <div
        aria-hidden="true"
        data-draggable-panel-resize=""
        className={cn(
          "absolute bottom-0 right-0 z-20 size-3 cursor-nwse-resize bg-transparent",
          showHandleHighlight && "hover:bg-primary/30 active:bg-primary/40",
        )}
        onPointerDown={onResizeCornerPointerDown}
        onPointerMove={onResizeCornerPointerMove}
        onPointerUp={onResizeCornerPointerUp}
      />
    );
  }, [
    canResize,
    isDraggable,
    onResizeCornerPointerDown,
    onResizeCornerPointerMove,
    onResizeCornerPointerUp,
    showHandleHighlight,
  ]);

  const floatCollapsedToggle = useMemo(() => {
    if (!isDraggable) return null;
    if (!expandable) return null;
    if (isExpand) return null;

    return (
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label="Expand panel"
        className="h-full w-full rounded-md"
        onClick={() => startTransition(() => setExpandState(true))}
      >
        <ArrowIcon className="size-4" />
      </Button>
    );
  }, [ArrowIcon, expandable, isDraggable, isExpand, setExpandState]);

  const floatCloseButton = useMemo(() => {
    if (!isDraggable) return null;
    if (!expandable) return null;
    if (!isExpand) return null;

    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Close panel"
        className="absolute right-2 top-2 z-30"
        onClick={() => startTransition(() => setExpandState(false))}
      >
        <X className="size-4" />
      </Button>
    );
  }, [expandable, isDraggable, isExpand, setExpandState]);

  if (fullscreen) {
    return (
      <div
        className={cn("absolute inset-x-0 bottom-0", className)}
        style={{ top: headerHeight, ...style }}
        {...rest}
      >
        {children}
      </div>
    );
  }

  return (
    <aside
      ref={rootRef}
      dir={dir}
      className={cn(
        // root 需要 `overflow-visible`，否则折叠态的 toggle（带负 offset）会被裁剪看不到
        "group shrink-0 overflow-visible border-border",
        mode === "float" ? "z-50" : "relative",
        borderClassName,
        isDraggable && "rounded-lg border bg-background shadow-lg",
        isExternalSizing && "h-full w-full shrink",
        className,
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerDown={onDragPointerDown}
      onPointerMove={onDragPointerMove}
      onPointerUp={onDragPointerUp}
      style={{
        ...positionStyle,
        ...sizeStyle,
        opacity: isPending ? 0.95 : 1,
        transition: isResizing
          ? "none"
          : "width 200ms ease, height 200ms ease, opacity 200ms ease",
        cursor: isDragging ? "grabbing" : undefined,
        ...style,
      }}
      {...rest}
    >
      {toggle}
      {resizeBar}
      {resizeCorner}
      {floatCloseButton}

      <div
        className={cn(
          "h-full w-full overflow-hidden bg-background",
          classNames?.content,
        )}
        style={{ backgroundColor, ...styles?.content }}
      >
        {isDraggable && !isExpand
          ? floatCollapsedToggle
          : destroyOnClose
            ? isExpand
              ? children
              : null
            : children}
      </div>
    </aside>
  );
});

DraggablePanel.displayName = "DraggablePanel";

export default DraggablePanel;
