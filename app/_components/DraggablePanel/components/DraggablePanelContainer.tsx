/**
 * DraggablePanelContainer
 *
 * 面板内部的“容器层”：
 * - 负责提供相对定位（用于 Header/Footer 等子元素布局）
 * - 负责裁剪溢出（overflow: hidden）
 *
 * 说明：该组件只做布局/样式封装，不包含任何业务逻辑。
 */
"use client";

import type { HTMLAttributes } from "react";
import { memo } from "react";
import { cn } from "@/utils/tools";

export type DraggablePanelContainerProps = HTMLAttributes<HTMLDivElement>;

const DraggablePanelContainer = memo<DraggablePanelContainerProps>(
  ({ className, ...rest }) => {
    return (
      <div className={cn("relative overflow-hidden", className)} {...rest} />
    );
  },
);

DraggablePanelContainer.displayName = "DraggablePanelContainer";

export default DraggablePanelContainer;
