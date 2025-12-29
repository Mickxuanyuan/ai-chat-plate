"use client";

import { LucideEdit, LucideX } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import DraggablePanel from "@/app/_components/DraggablePanel/DraggablePanel";
import { Button } from "@/app/_components/ui/button";
import { useSessionStore } from "@/store/session";
import { cn } from "@/utils/tools";

import ReadMode from "./ReadMode";

const WIDTH = 280;

const Config = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [showAgentSettings, toggleConfig, id] = useSessionStore(
    (s) => [s.showAgentSettings, s.toggleConfig, s.activeId],
    shallow,
  );

  return (
    <DraggablePanel
      className={cn(
        "absolute inset-y-0 right-0 z-50 border-l bg-background",
        "flex h-full w-[280px] flex-col",
      )}
      expand={showAgentSettings}
    >
      <div className="flex h-full min-h-0 flex-col" style={{ width: WIDTH }}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-medium">{t("agentProfile")}</div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("edit")}
              className="h-9 w-9 rounded-full"
              onClick={() => {
                if (!id) return;
                router.push(`/chat/${id}/edit`);
              }}
            >
              <LucideEdit className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("close")}
              className="h-9 w-9 rounded-full"
              onClick={() => toggleConfig(false)}
            >
              <LucideX className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ReadMode />
        </div>
      </div>
    </DraggablePanel>
  );
};

export default memo(Config);
