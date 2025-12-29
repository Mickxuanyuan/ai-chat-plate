"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/_components/ui/button";
import { agentSelectors, useSessionStore } from "@/store/session";
import { cn } from "@/utils/tools";

import { FormItem } from "./FormItem";

const Prompt = () => {
  const { t } = useTranslation("common");

  const systemRole = useSessionStore((s) => {
    const config = agentSelectors.currentAgentConfigSafe(s);
    return config.systemRole;
  }, shallow);

  const [updateAgentConfig] = useSessionStore(
    (s) => [s.updateAgentConfig],
    shallow,
  );

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(systemRole ?? "");

  useEffect(() => {
    if (!editing) setDraft(systemRole ?? "");
  }, [editing, systemRole]);

  const save = useCallback(() => {
    updateAgentConfig({ systemRole: draft });
    setEditing(false);
  }, [draft, updateAgentConfig]);

  return (
    <FormItem label={t("agentPrompt")}>
      <div className="flex flex-col gap-3">
        {editing ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={cn(
              "min-h-[160px] w-full resize-y rounded-xl border bg-background px-3 py-2 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
            placeholder={t("agentPrompt")}
          />
        ) : (
          <div className="whitespace-pre-wrap rounded-xl border bg-muted px-3 py-2 text-sm">
            {systemRole || "-"}
          </div>
        )}

        <div className="flex justify-end gap-2">
          {editing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditing(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="button" onClick={save}>
                {t("save")}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setEditing(true)}>
              {t("edit")}
            </Button>
          )}
        </div>
      </div>
    </FormItem>
  );
};

export default memo(Prompt);
