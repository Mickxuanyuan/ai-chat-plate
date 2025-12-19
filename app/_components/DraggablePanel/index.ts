"use client";

import type { ReactNode, RefAttributes } from "react";
import DraggablePanelBody from "./components/DraggablePanelBody";
import DraggablePanelContainer from "./components/DraggablePanelContainer";
import DraggablePanelFooter from "./components/DraggablePanelFooter";
import DraggablePanelHeader from "./components/DraggablePanelHeader";
import DraggablePanelLayout from "./components/DraggablePanelLayout";
import DraggablePanelBase from "./DraggablePanel";
import type { DraggablePanelProps } from "./interface";

export type DraggablePanelComponent = ((
  props: DraggablePanelProps & RefAttributes<HTMLDivElement>,
) => ReactNode) & {
  Body: typeof DraggablePanelBody;
  Container: typeof DraggablePanelContainer;
  Footer: typeof DraggablePanelFooter;
  Header: typeof DraggablePanelHeader;
  Layout: typeof DraggablePanelLayout;
};

export const DraggablePanel =
  DraggablePanelBase as unknown as DraggablePanelComponent;

DraggablePanel.Body = DraggablePanelBody;
DraggablePanel.Container = DraggablePanelContainer;
DraggablePanel.Footer = DraggablePanelFooter;
DraggablePanel.Header = DraggablePanelHeader;
DraggablePanel.Layout = DraggablePanelLayout;

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
export {
  type DraggablePanelLayoutProps,
  default as DraggablePanelLayout,
} from "./components/DraggablePanelLayout";

export type * from "./interface";
