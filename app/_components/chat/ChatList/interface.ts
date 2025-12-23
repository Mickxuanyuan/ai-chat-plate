import type { HTMLAttributes } from "react";

import type { ChatMessage } from "@/types/chatMessage";

/**
 * ChatList 操作类型。
 */
export type ChatListActionType = "copy" | "delete" | "edit" | "regenerate";

/**
 * ChatList 文案配置。
 */
export interface ChatListText {
  copy?: string;
  delete?: string;
  edit?: string;
  regenerate?: string;
}

/**
 * ChatList 组件 Props（纯展示组件）。
 */
export interface ChatListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 消息列表数据。
   */
  data: ChatMessage[];

  /**
   * 展示风格（bubble：气泡；docs：文档流）。
   * @default "bubble"
   */
  variant?: "bubble" | "docs";

  /**
   * 是否显示头像。
   * @default true
   */
  showAvatar?: boolean;

  /**
   * 是否显示标题（meta.title）。
   * @default false
   */
  showTitle?: boolean;

  /**
   * 正在加载中的消息 id（用于渲染加载态）。
   */
  loadingId?: string;

  /**
   * 文案配置。
   */
  text?: ChatListText;

  /**
   * 点击操作按钮回调。
   */
  onActionClick?: (
    action: ChatListActionType,
    id: string,
    message: ChatMessage,
  ) => void;

  /**
   * 当需要编辑消息时，提交新的内容。
   */
  onMessageChange?: (id: string, content: string) => void;
}
