import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

export type SideBarNavItem = {
  /**
   * Tab 唯一标识（由业务层定义）。
   */
  key: string;
  /**
   * 图标组件（建议传 lucide-react 的 icon）。
   */
  icon: LucideIcon;
  /**
   * 文案（用于 a11y 与 tooltip/title）。
   */
  label: string;
  /**
   * 是否禁用该 Tab。
   */
  disabled?: boolean;
};

export type SideBarActionItem = {
  /**
   * 操作唯一标识（可选）。
   */
  key?: string;
  /**
   * 图标组件（建议传 lucide-react 的 icon）。
   */
  icon: LucideIcon;
  /**
   * 文案（用于 a11y 与 tooltip/title）。
   */
  label: string;
  /**
   * 点击回调。
   */
  onClick?: () => void;
  /**
   * 是否禁用该操作。
   */
  disabled?: boolean;
};

export type SideBarProps = {
  /**
   * 顶部区域的头像/Logo（由外部注入，保持组件纯展示）。
   */
  avatar?: ReactNode;
  /**
   * Tab 列表（支持任意数量）。
   */
  items: SideBarNavItem[];
  /**
   * 当前激活的 Tab key。
   */
  activeKey: string;
  /**
   * 点击 Tab 时回调（由外部更新 store/路由等）。
   */
  onTabChange: (key: string) => void;
  /**
   * 底部操作区（例如设置、帮助等）。
   */
  bottomActions?: SideBarActionItem[];
  /**
   * 容器 className。
   */
  className?: string;
};
