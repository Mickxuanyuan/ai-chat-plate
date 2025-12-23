import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type ChatHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * 左侧区域内容（通常放：头像 + 标题/描述）。
   */
  left?: ReactNode;
  /**
   * 右侧区域内容（通常放：操作按钮组）。
   */
  right?: ReactNode;
  /**
   * 是否显示返回按钮（显示在左侧区域最前）。
   * @default false
   */
  showBackButton?: boolean;
  /**
   * 返回按钮点击回调。
   */
  onBackClick?: () => void;
  /**
   * Header 三段（left/center/right）之间的间距。
   * @default 16
   */
  gap?: number;
  /**
   * Header 内部每一段的子元素间距配置。
   */
  gaps?: {
    /** center 子元素间距 */
    center?: number;
    /** left 子元素间距 */
    left?: number;
    /** right 子元素间距 */
    right?: number;
  };
  /**
   * 自定义 className（仅作用在对应区域容器上）。
   */
  classNames?: {
    /** center 容器 className */
    center?: string;
    /** left 容器 className */
    left?: string;
    /** right 容器 className */
    right?: string;
  };
  /**
   * 自定义 style（仅作用在对应区域容器上）。
   */
  styles?: {
    /** center 容器 style */
    center?: CSSProperties;
    /** left 容器 style */
    left?: CSSProperties;
    /** right 容器 style */
    right?: CSSProperties;
  };
};

export type ChatHeaderTitleProps = {
  /**
   * 标题（支持 string / ReactNode）。
   */
  title: string | ReactNode;
  /**
   * 描述（可选，支持 string / ReactNode）。
   */
  desc?: string | ReactNode;
  /**
   * 标题右侧 tag 区域（可选）。
   */
  tag?: ReactNode;
};
