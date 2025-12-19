import type { CSSProperties, HTMLAttributes } from "react";

export type DraggablePanelPlacement = "right" | "left" | "top" | "bottom";

export type DraggablePanelSizeValue = number | string;

/**
 * 面板尺寸：
 * - 默认行为与旧实现一致：仅在一个方向上可缩放，另一方向由布局撑满（"100%"）
 */
export type DraggablePanelSize = {
  height?: DraggablePanelSizeValue;
  width?: DraggablePanelSizeValue;
};

export type DraggablePanelDelta = {
  height?: number;
  width?: number;
};

export type DraggablePanelResizing = Partial<
  Record<"top" | "right" | "bottom" | "left", boolean>
>;

export type DraggablePanelPosition = {
  x: number;
  y: number;
};

export type DraggablePanelPositionDelta = {
  x: number;
  y: number;
};

export interface DraggablePanelProps extends HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
  classNames?: {
    content?: string;
    handle?: string;
  };
  defaultExpand?: boolean;
  defaultSize?: Partial<DraggablePanelSize>;
  destroyOnClose?: boolean;
  expand?: boolean;
  expandable?: boolean;
  fullscreen?: boolean;
  headerHeight?: number;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  mode?: "fixed" | "float";
  onExpandChange?: (expand: boolean) => void;
  onSizeChange?: (
    delta: DraggablePanelDelta,
    size?: DraggablePanelSize,
  ) => void;
  onSizeDragging?: (
    delta: DraggablePanelDelta,
    size?: DraggablePanelSize,
  ) => void;
  pin?: boolean;
  placement: DraggablePanelPlacement;
  /**
   * 兼容旧的 `RndProps['enableResizing']`：
   * - `false`：禁用缩放
   * - `true`/`undefined`：允许缩放（仅生效于与 placement 相反的那一条边）
   * - `{ top/right/bottom/left }`：按边开关
   */
  resize?: boolean | DraggablePanelResizing;
  showBorder?: boolean;
  showHandleHighlight?: boolean;
  showHandleWhenCollapsed?: boolean;
  showHandleWideArea?: boolean;
  size?: Partial<DraggablePanelSize>;
  styles?: {
    content?: CSSProperties;
    handle?: CSSProperties;
  };
  /**
   * 方向：
   * - 不传时读取 `document.documentElement[dir]`
   */
  dir?: "ltr" | "rtl";

  /**
   * 可选增强：浮窗自由拖动（仅 `mode="float"` 生效）。
   * - 默认关闭，避免破坏旧用法
   */
  draggable?: boolean;
  dragHandleSelector?: string;
  defaultPosition?: DraggablePanelPosition;
  position?: DraggablePanelPosition;
  onPositionChange?: (
    delta: DraggablePanelPositionDelta,
    position: DraggablePanelPosition,
  ) => void;
  onPositionDragging?: (
    delta: DraggablePanelPositionDelta,
    position: DraggablePanelPosition,
  ) => void;

  /**
   * 尺寸控制方式：
   * - `internal`：由 DraggablePanel 自身控制 width/height（默认，保留原逻辑）
   * - `external`：由外层布局控制尺寸（例如配合 `ResizablePanelGroup`）
   * @default "internal"
   */
  sizing?: "internal" | "external";
}
