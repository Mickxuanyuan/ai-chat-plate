"use client";

import type { LucideIcon } from "lucide-react";
import { Copy, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { memo, useMemo } from "react";

import ActionIconGroup from "@/app/_components/chat/ActionIconGroup";
import type {
  ActionIconGroupItem,
  ActionIconGroupMenuItem,
} from "@/app/_components/chat/ActionIconGroup";

import type { ChatListActionType, ChatListText } from "../interface";

export interface ChatListItemActionItem {
  key: ChatListActionType;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  onClick?: (action: ChatListActionType) => void;
}

interface ChatListItemActionsProps {
  disabled?: boolean;
  items?: ChatListItemActionItem[];
  onActionClick: (action: ChatListActionType) => void;
  text?: ChatListText;
}

const ChatListItemActions = memo<ChatListItemActionsProps>(
  ({ disabled, items, onActionClick, text }) => {
    const defaultItems = useMemo<ChatListItemActionItem[]>(
      () => [
        { key: "copy", label: text?.copy ?? "Copy", icon: Copy },
        { key: "edit", label: text?.edit ?? "Edit", icon: Pencil },
        {
          key: "regenerate",
          label: text?.regenerate ?? "Regenerate",
          icon: RotateCcw,
        },
        { key: "delete", label: text?.delete ?? "Delete", icon: Trash2 },
      ],
      [text],
    );

    const actionItems = items?.length ? items : defaultItems;

    const actionIconItems = useMemo<ActionIconGroupItem[]>(
      () =>
        actionItems.map(({ key, label, icon, disabled: itemDisabled, onClick }) => ({
          key,
          icon,
          label,
          disabled: disabled || itemDisabled,
          onClick: () => {
            onActionClick(key);
            onClick?.(key);
          },
        })),
      [actionItems, disabled, onActionClick],
    );

    const actionMap = useMemo(() => {
      return actionIconItems.reduce<Record<ChatListActionType, ActionIconGroupItem | undefined>>(
        (acc, item) => {
          acc[item.key as ChatListActionType] = item;
          return acc;
        },
        {
          copy: undefined,
          delete: undefined,
          edit: undefined,
          regenerate: undefined,
        },
      );
    }, [actionIconItems]);

    const regenerate = actionMap.regenerate;
    const edit = actionMap.edit;
    const copy = actionMap.copy;
    const del = actionMap.delete;

    // 主操作展示在外层，更多操作放入菜单。
    const mainItems = [regenerate, edit].filter(Boolean) as ActionIconGroupItem[];
    const menuItems: ActionIconGroupMenuItem[] = [
      edit,
      copy,
      regenerate,
    ].filter(Boolean) as ActionIconGroupItem[];

    if (del) {
      if (menuItems.length > 0) {
        menuItems.push({ type: "divider" });
      }
      menuItems.push(del);
    }

    return (
      <ActionIconGroup
        items={mainItems}
        menu={menuItems.length ? { items: menuItems } : undefined}
        size="small"
        variant="borderless"
      />
    );
  },
);

ChatListItemActions.displayName = "ChatListItemActions";

export default ChatListItemActions;
