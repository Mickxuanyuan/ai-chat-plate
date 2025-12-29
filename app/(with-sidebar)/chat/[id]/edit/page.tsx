"use client";

import { useRouter } from "next/navigation";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import ChatHeader from "@/app/_components/chat/ChatHeader";
import { Button } from "@/app/_components/ui/button";

import AgentConfig from "./AgentConfig";
import AgentMeta from "./AgentMeta";

const EditPage = memo(() => {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <div className="flex h-dvh w-full flex-col">
      <ChatHeader
        showBackButton
        onBackClick={() => router.back()}
        left={
          <div className="text-sm font-medium">{t("editAgentProfile")}</div>
        }
        right={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-9 rounded-full"
            >
              {t("share")}
            </Button>
            <Button type="button" className="h-9 rounded-full">
              {t("export")}
            </Button>
          </div>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <AgentMeta />
          <AgentConfig />
        </div>
      </div>
    </div>
  );
});

export default EditPage;
