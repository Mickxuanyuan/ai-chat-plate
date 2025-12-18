"use client";

import { memo } from "react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/utils/tools";

import type { SideBarProps } from "./interface";
import { sideBarWidthClassName } from "./helpers";

export default memo<SideBarProps>(
  ({ avatar, items, activeKey, onTabChange, bottomActions, className }) => {
    return (
      <aside
        className={cn(
          "flex h-screen flex-col items-center justify-between border-r bg-background py-2",
          sideBarWidthClassName,
          className,
        )}
      >
        <div className="flex min-h-0 flex-col items-center gap-2">
          {avatar ? <div className="mt-1">{avatar}</div> : null}

          <nav className="mt-2 flex min-h-0 w-full flex-1 flex-col items-center gap-1 overflow-y-auto px-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeKey === item.key;

              return (
                <Button
                  key={item.key}
                  type="button"
                  size="icon"
                  variant={isActive ? "secondary" : "ghost"}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  disabled={item.disabled}
                  title={item.label}
                  onClick={() => onTabChange(item.key)}
                >
                  <Icon className="size-4" />
                </Button>
              );
            })}
          </nav>
        </div>

        {bottomActions && bottomActions.length > 0 ? (
          <div className="flex flex-col items-center gap-1 pb-2">
            {bottomActions.map((action, index) => {
              const Icon = action.icon;
              const key = action.key ?? `${action.label}-${index}`;
              return (
                <Button
                  key={key}
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={action.label}
                  disabled={action.disabled}
                  title={action.label}
                  onClick={action.onClick}
                >
                  <Icon className="size-4" />
                </Button>
              );
            })}
          </div>
        ) : null}
      </aside>
    );
  },
);
