import type { LucideIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes, MouseEvent, ReactNode } from "react";

export type ActionIconGroupEvent = {
  key: string;
  keyPath: string[];
  domEvent: MouseEvent<HTMLButtonElement>;
};

export type ActionIconGroupItem = {
  /**
   * 操作唯一标识。
   */
  key: string;
  /**
   * 文案（用于 a11y 与 tooltip/title）。
   */
  label: string;
  /**
   * 图标组件（建议传 lucide-react 的 icon）。
   */
  icon: LucideIcon;
  /**
   * 组件内部会将点击事件整理为 ActionIconGroupEvent 上报。
   */
  /**
   * 点击回调。
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * 是否禁用该操作。
   */
  disabled?: boolean;
  /**
   * 是否处于加载中。
   */
  loading?: boolean;
  /**
   * 是否为危险操作（高亮提示）。
   */
  danger?: boolean;
};

export type ActionIconGroupMenuItem =
  | {
      type: "divider";
      key?: string;
    }
  | (ActionIconGroupItem & { type?: "item" });

export type ActionIconGroupMenu = {
  /**
   * 菜单项列表。
   */
  items: ActionIconGroupMenuItem[];
  /**
   * 菜单项点击回调。
   */
  onClick?: (action: ActionIconGroupEvent) => void;
};

export type ActionIconGroupProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * 透传给每个按钮的属性（对所有 action 生效）。
   */
  actionIconProps?: Omit<ComponentProps<"button">, "type">;
  /**
   * 是否禁用全部按钮。
   */
  disabled?: boolean;
  /**
   * 是否使用玻璃拟态背景。
   */
  glass?: boolean;
  /**
   * 排列方向。
   */
  horizontal?: boolean;
  /**
   * 操作项列表。
   */
  items?: ActionIconGroupItem[];
  /**
   * 更多菜单配置。
   */
  menu?: ActionIconGroupMenu;
  /**
   * 操作点击回调。
   */
  onActionClick?: (action: ActionIconGroupEvent) => void;
  /**
   * 是否启用阴影。
   */
  shadow?: boolean;
  /**
   * 按钮尺寸。
   */
  size?: "small" | "medium" | "normal" | "large";
  /**
   * 样式变体。
   */
  variant?: "filled" | "outlined" | "borderless";
  /**
   * 自定义容器内容（一般不需要）。
   */
  children?: ReactNode;
};
