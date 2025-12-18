import type { CSSProperties, HTMLAttributes } from "react";

/**
 * 面板吸附/停靠的位置。
 *
 * - `left` / `right`：左右侧面板（垂直拖拽边缘可改变宽度）
 * - `top` / `bottom`：上下侧面板（水平拖拽边缘可改变高度）
 */
export type DraggablePanelPlacement = "right" | "left" | "top" | "bottom";

/**
 * `Size`：面板尺寸。
 *
 * - 当前实现使用 Pointer Events 手写拖拽缩放，因此用最小可用结构自定义类型
 * - 单位：px（number）
 */
export type DraggablePanelSize = {
  height?: number;
  width?: number;
};

/**
 * `NumberSize`：单次拖拽产生的尺寸变化量（delta）。
 * - 单位：px（number）
 */
export type DraggablePanelDelta = {
  height?: number;
  width?: number;
};

/**
 * 缩放边开关（与 placement 相反的那一条边会被用作缩放边）。
 * - 设计成对象是为了兼容“只允许某些边缩放”的使用习惯
 */
export type DraggablePanelResizing = Partial<
  Record<"top" | "right" | "bottom" | "left", boolean>
>;

/**
 * DraggablePanel：可折叠 + 可拖拽调整尺寸的容器面板。
 *
 * 设计定位（符合 `app/_components/*` 约定）：
 * - 纯 UI 组件：不读写 store、不发请求
 * - 支持受控/非受控：`expand`/`onExpandChange` 与 `defaultExpand`
 * - 支持“固定/悬浮”两种布局：`mode=fixed|float`
 *
 * 注意：`placement` 决定缩放方向与边框方向。
 */
export interface DraggablePanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 自定义背景色（用于 handle / 面板背景融合）。
   * - 不传则使用 Tailwind 主题的 `bg-background`
   */
  backgroundColor?: string;

  /**
   * 细粒度 className 注入。
   * - `content`: 面板内容区域（Resizable 容器）
   * - `handle`: 折叠/展开的 toggle 区域
   */
  classNames?: {
    content?: string;
    handle?: string;
  };

  /**
   * 默认是否展开（非受控场景使用）。
   * - 受控场景请使用 `expand` + `onExpandChange`
   * @default true
   */
  defaultExpand?: boolean;

  /**
   * 面板默认尺寸（非受控尺寸时使用）。
   * - `left/right`：默认 width=280, height=100%
   * - `top/bottom`：默认 height=180, width=100%
   */
  defaultSize?: DraggablePanelSize;

  /**
   * 折叠时是否卸载内容。
   * - `true`：折叠后不渲染 children（减少渲染开销，但会丢失内部状态）
   * - `false`：折叠后保持 children，只是把尺寸压到 0
   */
  destroyOnClose?: boolean;

  /**
   * 受控：当前是否展开。
   */
  expand?: boolean;

  /**
   * 是否允许展开/折叠（禁用 toggle 行为）。
   * @default true
   */
  expandable?: boolean;

  /**
   * 全屏模式：不展示拖拽/折叠能力，仅作为普通容器渲染。
   */
  fullscreen?: boolean;

  /**
   * 顶部预留高度（用于 `mode=float` 时计算 inset）。
   * @default 0
   */
  headerHeight?: number;

  /**
   * 最大高度（px）。
   */
  maxHeight?: number;

  /**
   * 最大宽度（px）。
   */
  maxWidth?: number;

  /**
   * 最小高度（px）。
   */
  minHeight?: number;

  /**
   * 最小宽度（px）。
   */
  minWidth?: number;

  /**
   * 布局模式：
   * - `fixed`：正常文档流占位
   * - `float`：绝对定位悬浮（不会挤压布局）
   * @default "fixed"
   */
  mode?: "fixed" | "float";

  /**
   * 展开状态变化回调（配合受控使用）。
   */
  onExpandChange?: (expand: boolean) => void;

  /**
   * 拖拽缩放结束回调（pointerup）。
   */
  onSizeChange?: (
    delta: DraggablePanelDelta,
    size?: DraggablePanelSize,
  ) => void;

  /**
   * 拖拽缩放进行中回调（pointermove）。
   */
  onSizeDragging?: (
    delta: DraggablePanelDelta,
    size?: DraggablePanelSize,
  ) => void;

  /**
   * 是否 pin（固定展开）。
   *
   * - `true`：不跟随 hover 自动展开/折叠
   * - `false`：hover 时自动展开，离开后延迟折叠（避免闪烁）
   * @default true
   */
  pin?: boolean;

  /**
   * 面板停靠位置（必填）。
   */
  placement: DraggablePanelPlacement;

  /**
   * 允许的缩放方向开关。
   * - 传 `false` 或在折叠态时会禁用缩放
   * - 不传表示允许缩放（仅生效于与 `placement` 相反的那一条边）
   */
  resize?: false | DraggablePanelResizing;

  /**
   * 是否展示边框。
   * @default true
   */
  showBorder?: boolean;

  /**
   * 是否在拖拽边缘 hover/active 时展示高亮。
   */
  showHandleHighlight?: boolean;

  /**
   * 折叠态是否展示 toggle（用于快速展开）。
   */
  showHandleWhenCollapsed?: boolean;

  /**
   * 是否扩大 toggle 的可点击区域（更易点到）。
   * @default true
   */
  showHandleWideArea?: boolean;

  /**
   * 受控：当前尺寸（配合 `onSizeChange`/`onSizeDragging` 使用）。
   */
  size?: DraggablePanelSize;

  /**
   * 细粒度 style 注入。
   * - `content`: Resizable 容器 style
   * - `handle`: toggle 区域 style
   */
  styles?: {
    content?: CSSProperties;
    handle?: CSSProperties;
  };
}
