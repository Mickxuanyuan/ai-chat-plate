"use client";

import { ChevronDown, LucideSparkles } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { agentSelectors, useSessionStore } from "@/store/session";
import { cn } from "@/utils/tools";

import { FormItem } from "./FormItem";
import isEqual from "lodash-es/isEqual";

const AgentMeta = () => {
  const { t } = useTranslation("common");

  const metaData = useSessionStore(agentSelectors.currentAgentMeta, isEqual);

  const [
    autocompleteMeta,
    autocompleteSessionAgentMeta,
    loading,
    updateAgentMeta,
    id,
    hasSystemRole,
  ] = useSessionStore(
    (s) => [
      s.autocompleteMeta,
      s.autocompleteSessionAgentMeta,
      s.autocompleteLoading,
      s.updateAgentMeta,
      s.activeId,
      agentSelectors.hasSystemRole(s),
    ],
    shallow,
  );

  const [open, setOpen] = useState(hasSystemRole);

  const basic = useMemo(
    () => [
      {
        key: "title" as const,
        label: t("agentName"),
        placeholder: t("agentNamePlaceholder"),
      },
      {
        key: "description" as const,
        label: t("agentDescription"),
        placeholder: t("agentDescriptionPlaceholder"),
      },
    ],
    [t],
  );

  const avatarSrc =
    typeof metaData.avatar === "string" &&
    /^(https?:\/\/|\/)/.test(metaData.avatar)
      ? metaData.avatar
      : undefined;
  const avatarFallback =
    typeof metaData.avatar === "string" && metaData.avatar && !avatarSrc
      ? metaData.avatar
      : (metaData.title ?? "A").slice(0, 1);

  const isAnyLoading = Object.values(loading).some(Boolean);

  const triggerFieldAutocomplete = useCallback(
    (key: (typeof basic)[number]["key"]) => {
      autocompleteMeta(key);
    },
    [autocompleteMeta],
  );

  return (
    <div className="rounded-xl border bg-background">
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3",
          "border-b text-left",
        )}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <div className="text-sm font-medium">{t("profile")}</div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-full"
            disabled={!hasSystemRole}
            aria-label={t("autoGenerateTooltip")}
            title={t("autoGenerateTooltip")}
            onClick={(e) => {
              e.stopPropagation();
              if (!id) return;
              autocompleteSessionAgentMeta(id, true);
            }}
          >
            {isAnyLoading ? t("loading") : t("autoGenerate")}
          </Button>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </div>

      {open ? (
        <div className="flex flex-col gap-6 p-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              {basic.map((item) => (
                <FormItem key={item.key} label={item.label}>
                  <div className="relative">
                    <input
                      value={metaData[item.key] ?? ""}
                      placeholder={item.placeholder}
                      onChange={(e) =>
                        updateAgentMeta({ [item.key]: e.target.value })
                      }
                      className={cn(
                        "h-10 w-full rounded-xl border bg-background pl-3 pr-10 text-sm",
                        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
                      aria-label={t("autoGenerate")}
                      title={t("autoGenerate")}
                      disabled={Boolean(loading[item.key])}
                      onClick={() => triggerFieldAutocomplete(item.key)}
                    >
                      <LucideSparkles
                        className={cn(
                          "h-4 w-4",
                          loading[item.key] && "animate-pulse",
                        )}
                      />
                    </Button>
                  </div>
                </FormItem>
              ))}
            </div>

            <FormItem label={t("agentAvatar")}>
              <div className="flex justify-center">
                <Avatar className="h-[200px] w-[200px]">
                  {avatarSrc ? (
                    <AvatarImage
                      alt={metaData.title ?? "avatar"}
                      src={avatarSrc}
                    />
                  ) : null}
                  <AvatarFallback
                    style={{ backgroundColor: metaData.backgroundColor }}
                  >
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </div>
            </FormItem>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default memo(AgentMeta);
