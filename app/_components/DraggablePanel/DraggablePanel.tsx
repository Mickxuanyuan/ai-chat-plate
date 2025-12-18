"use client";

/**
 * DraggablePanel（当前项目实现）
 *
 * 目标：在不引入额外第三方库的前提下，实现一个“可折叠 + 可拖拽调整尺寸”的面板容器。
 *
 * 为什么要重写：
 * - 旧实现依赖 `antd/antd-style/ahooks/re-resizable/react-layout-kit/use-merge-value` 等，本项目 `package.json`
 *   并未声明这些依赖；为了“统一技术栈”，这里改为 Tailwind + 原生 Pointer Events 实现。
 *
 * 功能点（保持与旧版本一致的用户体验）：
 * - 支持受控/非受控展开：`expand` / `onExpandChange` 与 `defaultExpand`
 * - 支持固定/悬浮：`mode=fixed|float`
 * - 支持 hover 自动展开：当 `pin=false` 时 hover 展开，离开后延迟折叠
 * - 支持拖拽改变尺寸：仅允许拖拽与 `placement` 相反的那条边（例如 left 面板拖右边缘）
 * - 支持 `destroyOnClose`：折叠时是否卸载 children
 *
 * 组件定位：纯 UI（`app/_components/*`）——不读写 store、不发请求。
 */

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
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

import { cn } from "@/utils/tools";

import { reversePlacement } from "./helpers";
import type {
  DraggablePanelDelta,
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

type ResizeEdge = "top" | "right" | "bottom" | "left";

function clampNumber(value: number, min?: number, max?: number) {
  const safeMin = typeof min === "number" ? min : -Infinity;
  const safeMax = typeof max === "number" ? max : Infinity;
  return Math.min(safeMax, Math.max(safeMin, value));
}

function isResizeEnabled(
  resize: DraggablePanelProps["resize"],
  edge: ResizeEdge,
) {
  if (resize === false) return false;
  if (!resize) return true;
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
    showHandleWhenCollapsed,
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
    classNames,
    styles,
    className,
    style,
    backgroundColor,
    dir,
    children,
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  /**
   * 展开状态（受控/非受控）
   */
  const [internalExpand, setInternalExpand] = useState(defaultExpand);
  const isExpand = expand ?? internalExpand;

  const setExpandState = useCallback(
    (next: boolean) => {
      if (!expandable) return;

      if (expand === undefined) {
        setInternalExpand(next);
      }
      onExpandChange?.(next);
    },
    [expand, expandable, onExpandChange],
  );

  /**
   * 方向处理（支持通过 `dir="rtl"` 让左右 placement 翻转）
   */
  const internalPlacement = useMemo(() => {
    if (dir !== "rtl") return placement;
    if (placement === "left") return "right";
    if (placement === "right") return "left";
    return placement;
  }, [dir, placement]);

  const isVertical =
    internalPlacement === "top" || internalPlacement === "bottom";
  const resizeEdge = reversePlacement(internalPlacement) as ResizeEdge;

  /**
   * 尺寸状态（受控/非受控）
   *
   * 说明：
   * - 面板只会在一个方向上缩放（width 或 height），另一个方向由布局撑满
   * - 我们只存储可缩放方向的尺寸，避免不必要的状态复杂度
   */
  const [internalSize, setInternalSize] = useState<DraggablePanelSize>(() => {
    if (isVertical) {
      return {
        height: defaultSize?.height ?? DEFAULT_HEIGHT,
      };
    }
    return {
      width: defaultSize?.width ?? DEFAULT_WIDTH,
    };
  });

  const resolvedSize = size ?? internalSize;

  /**
   * Hover 自动展开/折叠（当 pin=false）
   */
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

  /**
   * Pointer 拖拽缩放
   */
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startSize: DraggablePanelSize;
  } | null>(null);

  const applyResize = useCallback(
    (
      next: DraggablePanelSize,
      delta: DraggablePanelDelta,
      isFinal: boolean,
    ) => {
      if (size === undefined) {
        setInternalSize(next);
      }

      if (isFinal) onSizeChange?.(delta, next);
      else onSizeDragging?.(delta, next);
    },
    [onSizeChange, onSizeDragging, size],
  );

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isExpand) return;
      if (!isResizeEnabled(resize, resizeEdge)) return;

      setIsResizing(true);

      const startSize: DraggablePanelSize = {
        width: resolvedSize.width,
        height: resolvedSize.height,
      };

      resizeStartRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startSize,
      };

      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [isExpand, resize, resizeEdge, resolvedSize.height, resolvedSize.width],
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
        const startWidth = start.startSize.width ?? DEFAULT_WIDTH;
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
        delta.width = nextWidth - startWidth;
      } else {
        const startHeight = start.startSize.height ?? DEFAULT_HEIGHT;
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

  const onResizePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = resizeStartRef.current;
      if (!start) return;
      if (e.pointerId !== start.pointerId) return;

      // 复用 move 的计算逻辑，但以“最终”事件触发 onSizeChange
      const dx = e.clientX - start.startClientX;
      const dy = e.clientY - start.startClientY;

      const next: DraggablePanelSize = { ...start.startSize };
      const delta: DraggablePanelDelta = {};

      if (!isVertical) {
        const startWidth = start.startSize.width ?? DEFAULT_WIDTH;
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
        delta.width = nextWidth - startWidth;
      } else {
        const startHeight = start.startSize.height ?? DEFAULT_HEIGHT;
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

  /**
   * Toggle（折叠/展开）按钮图标：与 placement 方向对应
   */
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
    const shouldShow = expandable && (isExpand || showHandleWhenCollapsed);
    if (!shouldShow) return null;

    const isHorizontal =
      internalPlacement === "left" || internalPlacement === "right";

    const wrapperClassName = cn(
      "absolute z-10 opacity-0 transition-opacity",
      "group-hover:opacity-100",
      showHandleWideArea ? "pointer-events-auto" : "pointer-events-none",
      internalPlacement === "left" && "inset-y-0 right-[-16px] w-4",
      internalPlacement === "right" && "inset-y-0 left-[-16px] w-4",
      internalPlacement === "top" && "inset-x-0 bottom-[-16px] h-4",
      internalPlacement === "bottom" && "inset-x-0 top-[-16px] h-4",
    );

    const buttonClassName = cn(
      "pointer-events-auto absolute flex items-center justify-center border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground",
      isHorizontal ? "top-1/2 -translate-y-1/2" : "left-1/2 -translate-x-1/2",
      internalPlacement === "left" &&
        "right-0 h-4 w-12 rounded-b-lg rounded-t-lg border-l-0",
      internalPlacement === "right" &&
        "left-0 h-4 w-12 rounded-b-lg rounded-t-lg border-r-0",
      internalPlacement === "top" &&
        "bottom-0 h-4 w-12 rounded-t-lg border-b-0",
      internalPlacement === "bottom" &&
        "top-0 h-4 w-12 rounded-b-lg border-t-0",
      !isExpand && "opacity-100",
    );

    return (
      <div className={wrapperClassName}>
        <button
          type="button"
          className={buttonClassName}
          aria-label={isExpand ? "Collapse panel" : "Expand panel"}
          onClick={() => startTransition(() => setExpandState(!isExpand))}
          style={styles?.handle}
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
    expandable,
    internalPlacement,
    isExpand,
    setExpandState,
    showHandleWhenCollapsed,
    showHandleWideArea,
    styles?.handle,
  ]);

  /**
   * 布局 + 尺寸样式（固定/悬浮）
   */
  const positionStyle: CSSProperties = useMemo(() => {
    if (mode !== "float") return {};

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
  }, [headerHeight, internalPlacement, mode]);

  const sizeStyle: CSSProperties = useMemo(() => {
    if (!isExpand) {
      return isVertical
        ? { height: 0, width: "100%" }
        : { height: "100%", width: 0 };
    }

    if (isVertical) {
      return { height: resolvedSize.height ?? DEFAULT_HEIGHT, width: "100%" };
    }

    return { height: "100%", width: resolvedSize.width ?? DEFAULT_WIDTH };
  }, [isExpand, isVertical, resolvedSize.height, resolvedSize.width]);

  const borderClassName = useMemo(() => {
    if (!showBorder || !isExpand) return "";
    if (internalPlacement === "left") return "border-r";
    if (internalPlacement === "right") return "border-l";
    if (internalPlacement === "top") return "border-b";
    return "border-t";
  }, [internalPlacement, isExpand, showBorder]);

  const canResize = isExpand && isResizeEnabled(resize, resizeEdge);
  const resizeBar = useMemo(() => {
    if (!canResize) return null;

    const isHorizontal =
      internalPlacement === "left" || internalPlacement === "right";

    return (
      <div
        aria-hidden="true"
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
    onResizePointerDown,
    onResizePointerMove,
    onResizePointerUp,
    showHandleHighlight,
  ]);

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
        "group shrink-0 overflow-hidden border-border",
        mode === "float" ? "z-50" : "relative",
        borderClassName,
        className,
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...positionStyle,
        ...sizeStyle,
        opacity: isPending ? 0.95 : 1,
        transition: isResizing
          ? "none"
          : "width 200ms ease, height 200ms ease, opacity 200ms ease",
        ...style,
      }}
      {...rest}
    >
      {toggle}
      {resizeBar}

      <div
        className={cn("h-full w-full bg-background", classNames?.content)}
        style={{ backgroundColor, ...styles?.content }}
      >
        {destroyOnClose ? (isExpand ? children : null) : children}
      </div>
    </aside>
  );
});

DraggablePanel.displayName = "DraggablePanel";

export default DraggablePanel;
