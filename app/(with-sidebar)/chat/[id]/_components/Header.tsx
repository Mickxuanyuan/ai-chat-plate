"use client";

import { Archive, MoreVertical, Pencil, Share2 } from "lucide-react";
import { memo } from "react";

import ChatHeader, { ChatHeaderTitle } from "@/app/_components/chat/ChatHeader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { DEFAULT_TITLE } from "@/store/session/slices/agentConfig";
import { cn } from "@/utils/tools";

export type ChatSessionHeaderProps = {
  title?: string;
  description?: string;
  avatar?: string;
  avatarBackground?: string;
  onShare?: () => void;
  onArchive?: () => void;
  onEdit?: () => void;
  onToggleSettings?: () => void;
};

const ChatSessionHeader = memo<ChatSessionHeaderProps>(
  ({
    title,
    description,
    avatar,
    avatarBackground,
    onShare,
    onArchive,
    onEdit,
    onToggleSettings,
  }) => {
    return (
      <ChatHeader
        left={
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              className="h-10 w-10"
              style={{ background: avatarBackground }}
            >
              <AvatarImage src={avatar} alt={title || DEFAULT_TITLE} />
              <AvatarFallback>
                {(title || DEFAULT_TITLE).slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <ChatHeaderTitle
              title={title || DEFAULT_TITLE}
              desc={description || "No description"}
            />
          </div>
        }
        right={
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                !onShare && "pointer-events-none opacity-40",
              )}
              aria-label="Share"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                !onArchive && "pointer-events-none opacity-40",
              )}
              aria-label="Archive"
              onClick={onArchive}
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                !onEdit && "pointer-events-none opacity-40",
              )}
              aria-label="Edit"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                !onToggleSettings && "pointer-events-none opacity-40",
              )}
              aria-label="Settings"
              onClick={onToggleSettings}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        }
      />
    );
  },
);

ChatSessionHeader.displayName = "ChatSessionHeader";

export default ChatSessionHeader;
