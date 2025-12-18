/**
 * DraggablePanelFooter
 *
 * 面板底部区域：
 * - 常用于放置操作按钮、辅助信息等
 * - 自带上边框与 padding
 *
 * 说明：该组件只做布局/样式封装，不包含任何业务逻辑。
 */
"use client";

import type { HTMLAttributes } from "react";
import { memo } from "react";
import { cn } from "@/utils/tools";

export type DraggablePanelFooterProps = HTMLAttributes<HTMLDivElement>;

const DraggablePanelFooter = memo<DraggablePanelFooterProps>(
  ({ className, ...rest }) => {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-start gap-2 border-t p-4",
          className,
        )}
        {...rest}
      />
    );
  },
);

DraggablePanelFooter.displayName = "DraggablePanelFooter";

export default DraggablePanelFooter;
