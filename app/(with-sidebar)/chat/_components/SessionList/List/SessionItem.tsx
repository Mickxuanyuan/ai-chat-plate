"use client";

import { X } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { sessionSelectors, useSessionStore } from "@/store/session";
import { DEFAULT_TITLE } from "@/store/session/slices/agentConfig";
import { cn } from "@/utils/tools";

type SessionItemProps = {
  active: boolean;
  id: string;
  loading: boolean;
  onRemove: (id: string) => void;
};

const formatDate = (timestamp?: number) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
  });
};

const SessionItem = memo<SessionItemProps>(
  ({ id, active, loading, onRemove }) => {
    const { t } = useTranslation("common");
    const [title, description, systemRole, avatar, avatarBackground, updateAt] =
      useSessionStore((s) => {
        const session = sessionSelectors.getSessionById(id)(s);
        const meta = session.meta;

        return [
          meta.title,
          meta.description,
          session.config.systemRole,
          sessionSelectors.getAgentAvatar(meta),
          meta.backgroundColor,
          session.updateAt,
        ];
      }, shallow);

    const displayTitle = title || DEFAULT_TITLE;
    const displayDesc = description || systemRole || "";

    return (
      <div
        className={cn(
          "group/session-item relative flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
          active ? "bg-muted" : "hover:bg-muted/60",
        )}
      >
        <div className="shrink-0">
          <Avatar
            className="h-10 w-10"
            style={{ background: avatarBackground }}
          >
            <AvatarImage src={avatar} alt={displayTitle} />
            <AvatarFallback>{displayTitle.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{displayTitle}</div>
              {displayDesc ? (
                <div className="truncate text-xs text-muted-foreground">
                  {displayDesc}
                </div>
              ) : null}
            </div>

            <div className="shrink-0 text-xs text-muted-foreground transition-opacity group-hover/session-item:opacity-0">
              {loading ? t("loading") : formatDate(updateAt)}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("confirmRemoveSessionItemAlert")}
              className={cn(
                "absolute right-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 group-hover/session-item:inline-flex",
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm(t("confirmRemoveSessionItemAlert"))) onRemove(id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

SessionItem.displayName = "SessionItem";

export default SessionItem;
