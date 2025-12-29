"use client";

import { LucideChevronRight, type LucideIcon } from "lucide-react";
import { memo } from "react";

import { cn } from "@/utils/tools";

/**
 * 单个配置项（用于 ReadMode 展示）。
 */
export interface ConfigItem {
  /**
   * 左侧图标。
   */
  icon: LucideIcon;
  /**
   * 左侧文案。
   */
  label: string;
  /**
   * 右侧值；不传则展示箭头表示可进入。
   */
  value?: string | number;
}

/**
 * 单行配置单元格 Props。
 */
export type ConfigCellProps = ConfigItem;

/**
 * 单行配置单元格：左侧 icon + label，右侧 value/箭头。
 */
export const ConfigCell = memo<ConfigCellProps>(({ icon, label, value }) => {
  const Icon = icon;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md bg-muted px-3 py-2",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div className="truncate text-sm">{label}</div>
      </div>
      <div className="shrink-0 text-sm text-muted-foreground">
        {value ?? <LucideChevronRight className="h-4 w-4" />}
      </div>
    </div>
  );
});

/**
 * 配置分组 Props。
 */
export interface CellGroupProps {
  /**
   * 配置项数组。
   */
  items: ConfigItem[];
}

/**
 * 配置分组：同一组配置项垂直排列，带分割线。
 */
export const ConfigCellGroup = memo<CellGroupProps>(({ items }) => {
  return (
    <div className="overflow-hidden rounded-md bg-muted">
      {items.map(({ label, icon, value }, index) => {
        const Icon = icon;
        const isLast = items.length === index + 1;

        return (
          <div
            key={label}
            className={cn(
              "flex items-center justify-between px-3 py-2",
              !isLast && "border-b border-border/60",
            )}
          >
            <div className="flex min-w-0 items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <div className="truncate text-sm">{label}</div>
            </div>
            <div className="shrink-0 text-sm text-muted-foreground">
              {value ?? <LucideChevronRight className="h-4 w-4" />}
            </div>
          </div>
        );
      })}
    </div>
  );
});
