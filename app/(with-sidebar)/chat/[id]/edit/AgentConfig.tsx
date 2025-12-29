"use client";

import { ChevronDown } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/_components/ui/button";
import { agentSelectors, useSessionStore } from "@/store/session";
import { LanguageModel } from "@/types/llm";
import { cn } from "@/utils/tools";

import { FormItem } from "./FormItem";
import Prompt from "./Prompt";
import isEqual from "lodash-es/isEqual";

const AgentConfig = () => {
  const { t } = useTranslation("common");

  const config = useSessionStore(
    agentSelectors.currentAgentConfigSafe,
    isEqual,
  );
  const [updateAgentConfig] = useSessionStore(
    (s) => [s.updateAgentConfig],
    shallow,
  );

  const modelOptions = useMemo(
    () =>
      Object.values(LanguageModel).map((value) => ({
        label: t(value),
        value,
      })),
    [t],
  );

  const temperatureValue = Number(config.params.temperature ?? 0.7);

  return (
    <div className="rounded-xl border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="text-sm font-medium">{t("modelConfig")}</div>
      </div>

      <div className="flex flex-col gap-6 p-4">
        <FormItem label={t("agentModel")}>
          <div className="flex flex-wrap gap-2">
            {modelOptions.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant={config.model === opt.value ? "default" : "secondary"}
                className="h-9 rounded-full px-3"
                onClick={() => updateAgentConfig({ model: opt.value })}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </FormItem>

        <Prompt />

        <details className="group rounded-lg border bg-muted/30 open:bg-muted/20">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium",
              "select-none",
            )}
          >
            <span>{t("advanceSettings")}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>

          <div className="p-4 pt-2">
            <FormItem label={t("modelTemperature")}>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={
                    Number.isFinite(temperatureValue) ? temperatureValue : 0.7
                  }
                  className="flex-1"
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value);
                    updateAgentConfig({ params: { temperature: value } });
                  }}
                />
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={
                    Number.isFinite(temperatureValue) ? temperatureValue : 0.7
                  }
                  className={cn(
                    "h-9 w-[84px] rounded-md border bg-background px-2 text-sm",
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                  )}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value);
                    if (!Number.isFinite(value)) return;
                    updateAgentConfig({ params: { temperature: value } });
                  }}
                />
              </div>
            </FormItem>
          </div>
        </details>
      </div>
    </div>
  );
};

export default memo(AgentConfig);
