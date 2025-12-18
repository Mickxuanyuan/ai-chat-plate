"use client";

import type { ReactNode, RefAttributes } from "react";
import DraggablePanelBody from "./components/DraggablePanelBody";
import DraggablePanelContainer from "./components/DraggablePanelContainer";
import DraggablePanelFooter from "./components/DraggablePanelFooter";
import DraggablePanelHeader from "./components/DraggablePanelHeader";
import DraggablePanelBase from "./DraggablePanel";
import type { DraggablePanelProps } from "./interface";

/**
 * 标准导出形态：
 * - `default`: DraggablePanel（并挂载静态子组件）
 * - `named`: `DraggablePanel` / `DraggablePanelHeader` 等
 * - `types`: `DraggablePanelProps` 等
 *
 * 说明：这里将子组件挂到主组件上，便于使用方以 `DraggablePanel.Header` 的方式组织结构。
 */
export type DraggablePanelComponent = ((
  props: DraggablePanelProps & RefAttributes<HTMLDivElement>,
) => ReactNode) & {
  Body: typeof DraggablePanelBody;
  Container: typeof DraggablePanelContainer;
  Footer: typeof DraggablePanelFooter;
  Header: typeof DraggablePanelHeader;
};

export const DraggablePanel =
  DraggablePanelBase as unknown as DraggablePanelComponent;

DraggablePanel.Body = DraggablePanelBody;
DraggablePanel.Container = DraggablePanelContainer;
DraggablePanel.Footer = DraggablePanelFooter;
DraggablePanel.Header = DraggablePanelHeader;

export default DraggablePanel;

export {
  type DraggablePanelBodyProps,
  default as DraggablePanelBody,
} from "./components/DraggablePanelBody";
export {
  type DraggablePanelContainerProps,
  default as DraggablePanelContainer,
} from "./components/DraggablePanelContainer";
export {
  type DraggablePanelFooterProps,
  default as DraggablePanelFooter,
} from "./components/DraggablePanelFooter";
export {
  type DraggablePanelHeaderProps,
  default as DraggablePanelHeader,
} from "./components/DraggablePanelHeader";

export type * from "./interface";
