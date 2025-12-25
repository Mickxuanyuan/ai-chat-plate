import type { HTMLAttributes, ReactNode } from "react";

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
  history?: string;
  regenerate?: string;
}

export type ChatListRenderItems = (
  message: ChatMessage,
  defaultItem: ReactNode,
) => ReactNode;

export type ChatListRenderMessages = (message: ChatMessage) => ReactNode;

export type ChatListRenderErrorMessages = (message: ChatMessage) => ReactNode;

export type ChatListRenderMessagesExtra = (message: ChatMessage) => ReactNode;

export type ChatListRenderActions = (
  message: ChatMessage,
  defaultActions: ReactNode,
) => ReactNode;

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
   * 是否启用历史消息分割线。
   * @default false
   */
  enableHistoryCount?: boolean;

  /**
   * 历史消息数量阈值，用于显示分割线。
   * @default 0
   */
  historyCount?: number;

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
   * 点击操作按钮回调（推荐）。
   */
  onActionsClick?: (
    action: ChatListActionType,
    id: string,
    message: ChatMessage,
  ) => void;

  /**
   * 点击头像回调。
   */
  onAvatarsClick?: (message: ChatMessage) => void;

  /**
   * 当需要编辑消息时，提交新的内容。
   */
  onMessageChange?: (id: string, content: string) => void;

  /**
   * 自定义消息项渲染。
   */
  renderItems?: ChatListRenderItems;

  /**
   * 自定义消息内容渲染。
   */
  renderMessages?: ChatListRenderMessages;

  /**
   * 自定义错误消息渲染。
   */
  renderErrorMessages?: ChatListRenderErrorMessages;

  /**
   * 自定义消息额外内容渲染。
   */
  renderMessagesExtra?: ChatListRenderMessagesExtra;

  /**
   * 自定义操作区渲染。
   */
  renderActions?: ChatListRenderActions;
}
