/**
 * DraggablePanelBody
 *
 * 面板主体内容区域：
 * - 默认可滚动（overflow-y: auto）
 * - 默认 padding：16px
 *
 * 说明：该组件只做布局/样式封装，不包含任何业务逻辑。
 */
"use client";

import type { HTMLAttributes } from "react";
import { memo } from "react";
import { cn } from "@/utils/tools";

export type DraggablePanelBodyProps = HTMLAttributes<HTMLDivElement>;

const DraggablePanelBody = memo<DraggablePanelBodyProps>(
  ({ className, ...rest }) => {
    return (
      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden p-4",
          className,
        )}
        {...rest}
      />
    );
  },
);

DraggablePanelBody.displayName = "DraggablePanelBody";

export default DraggablePanelBody;
