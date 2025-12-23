import type { HTMLAttributes, ReactNode } from "react";

export type DraggablePanelPlacement = "right" | "left" | "top" | "bottom";

export interface DraggablePanelProps extends HTMLAttributes<HTMLDivElement> {
  destroyOnClose?: boolean;
  /**
   * 是否展开（受控）。
   * - 展开/折叠按钮由外层（如 Header / Layout）提供
   * @default true
   */
  expand?: boolean;
  children?: ReactNode;
}

export type DraggablePanelLayoutPanelProps = {
  placement: DraggablePanelPlacement;
  destroyOnClose?: boolean;
  expand?: boolean;
  defaultExpand?: boolean;
  onExpandChange?: (expand: boolean) => void;
};
