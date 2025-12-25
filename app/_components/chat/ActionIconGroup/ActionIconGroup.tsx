"use client";

import { Loader2, MoreHorizontal } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/utils/tools";

import type {
  ActionIconGroupEvent,
  ActionIconGroupMenuItem,
  ActionIconGroupProps,
} from "./interface";

const ActionIconGroup = memo<ActionIconGroupProps>(
  ({
    variant = "filled",
    disabled = false,
    shadow = false,
    glass = false,
    actionIconProps,
    items = [],
    horizontal = true,
    menu,
    onActionClick,
    className,
    size = "small",
    children,
    ...rest
  }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!menuOpen) return;

      // 点击触发器/面板外部时关闭菜单。
      const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as Node | null;
        if (!target) return;
        if (menuPanelRef.current?.contains(target)) return;
        if (menuButtonRef.current?.contains(target)) return;
        setMenuOpen(false);
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [menuOpen]);

    // 将组件的 variant 映射为 shadcn Button 的 variant。
    const baseVariant =
      variant === "outlined"
        ? "outline"
        : variant === "borderless"
        ? "ghost"
        : "secondary";

    const isMedium = size === "medium" || size === "normal";
    const buttonSize =
      size === "large" ? "icon-lg" : isMedium ? "icon" : "icon-sm";
    const iconSizeClass =
      size === "large" ? "size-5" : isMedium ? "size-4" : "size-3.5";

    const {
      className: actionClassName,
      onClick: onActionIconClick,
      title: actionTitle,
      ...actionRestProps
    } = actionIconProps ?? {};
    const actionAriaLabel = actionIconProps?.["aria-label"];

    const groupClassName = cn(
      "inline-flex items-center rounded-md p-0.5",
      horizontal ? "flex-row gap-1" : "flex-col gap-1",
      variant === "outlined" && "border border-border/70 bg-background",
      variant === "filled" && "bg-muted/70",
      glass && "border border-border/60 bg-background/70 backdrop-blur",
      shadow && "shadow-sm",
      disabled && "pointer-events-none opacity-60",
      className
    );

    // 统一 action 事件结构，供 item/menu 点击回调使用。
    const buildActionEvent = (
      key: string,
      event: ReactMouseEvent<HTMLButtonElement>
    ): ActionIconGroupEvent => ({
      key,
      keyPath: [key],
      domEvent: event,
    });

    const renderMenuItem = (item: ActionIconGroupMenuItem, index: number) => {
      if (item.type === "divider") {
        return (
          <div
            key={item.key ?? `divider-${index}`}
            className="my-1 h-px w-full bg-border/70"
            role="separator"
          />
        );
      }

      const isDisabled = disabled || item.disabled;
      const Icon = item.icon;

      return (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          disabled={isDisabled}
          className={cn(
            "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            item.danger && "text-destructive hover:text-destructive"
          )}
          onClick={(event) => {
            const action = buildActionEvent(item.key, event);
            onActionClick?.(action);
            menu?.onClick?.(action);
            item.onClick?.(event);
            // 选择菜单项后关闭菜单，保持交互可预期。
            setMenuOpen(false);
          }}
        >
          <Icon className={cn("shrink-0", iconSizeClass)} />
          <span className="truncate">{item.label}</span>
        </button>
      );
    };

    return (
      <div className={groupClassName} {...rest}>
        {items.map((item) => {
          const Icon = item.icon;
          const isDisabled = disabled || item.disabled || item.loading;
          const isDangerFilled = item.danger && variant === "filled";

          return (
            <Button
              key={item.key}
              type="button"
              size={buttonSize}
              variant={isDangerFilled ? "destructive" : baseVariant}
              {...actionRestProps}
              disabled={isDisabled}
              aria-label={actionAriaLabel ?? item.label}
              title={actionTitle ?? item.label}
              className={cn(
                item.danger && !isDangerFilled && "text-destructive",
                actionClassName
              )}
              onClick={(event) => {
                onActionIconClick?.(event);
                const action = buildActionEvent(item.key, event);
                onActionClick?.(action);
                item.onClick?.(event);
              }}
            >
              {item.loading ? (
                <Loader2 className={cn("animate-spin", iconSizeClass)} />
              ) : (
                <Icon className={iconSizeClass} />
              )}
            </Button>
          );
        })}
        {menu?.items?.length ? (
          <div className="relative">
            <Button
              ref={menuButtonRef}
              type="button"
              size={buttonSize}
              variant={baseVariant}
              {...actionRestProps}
              disabled={disabled}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={actionAriaLabel ?? "More actions"}
              title={actionTitle ?? "More"}
              className={actionClassName}
              onClick={(event) => {
                onActionIconClick?.(event);
                setMenuOpen((prev) => !prev);
              }}
            >
              <MoreHorizontal className={iconSizeClass} />
            </Button>
            {menuOpen ? (
              <div
                ref={menuPanelRef}
                role="menu"
                className={cn(
                  "absolute right-0 z-20 mt-2 min-w-[160px] rounded-md border",
                  "bg-popover p-1 text-popover-foreground shadow-md"
                )}
              >
                {menu.items.map(renderMenuItem)}
              </div>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    );
  }
);

ActionIconGroup.displayName = "ActionIconGroup";

export default ActionIconGroup;
