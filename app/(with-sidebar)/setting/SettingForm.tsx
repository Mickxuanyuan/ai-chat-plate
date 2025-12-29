"use client";

import isEqual from "lodash-es/isEqual";
import type { ReactNode } from "react";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { useTheme } from "@/app/_components/ThemeProvider";
import { Button } from "@/app/_components/ui/button";
import AvatarWithUpload from "@/features/AvatarWithUpload";
import { options as localeOptions } from "@/locales/options";
import { settingsSelectors, useSettings } from "@/store/settings";
import { LanguageModel } from "@/types/llm";
import type { Locales } from "@/types/locale";
import { cn } from "@/utils/tools";

import SliderWithInput from "./SliderWithInput";
import { ThemeSwatchesNeutral, ThemeSwatchesPrimary } from "./ThemeSwatches";

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-background">
      <div className="border-b px-4 py-3">
        <div className="text-sm font-medium">{title}</div>
        {desc ? (
          <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
        ) : null}
      </div>
      <div className="flex flex-col gap-6 p-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-sm">{label}</div>
        {desc ? (
          <div className="text-xs text-muted-foreground">{desc}</div>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-foreground"
      />
    </label>
  );
}

const SettingForm = memo(() => {
  const { t } = useTranslation("setting");
  const { mode, setMode } = useTheme();

  const settings = useSettings(settingsSelectors.currentSettings, isEqual);
  const { setSettings, resetSettings } = useSettings(
    (s) => ({
      resetSettings: s.resetSettings,
      setSettings: s.setSettings,
    }),
    shallow,
  );

  const resetAll = useCallback(() => {
    const ok = confirm(t("danger.reset.confirm"));
    if (!ok) return;
    resetSettings();
    setMode("system");
  }, [resetSettings, setMode, t]);

  const models = useMemo(() => Object.values(LanguageModel), []);

  return (
    <div className="flex flex-col gap-4">
      <Section title={t("settingTheme.title")}>
        <Field label={t("settingTheme.avatar.title")}>
          <AvatarWithUpload />
        </Field>

        <Field label={t("settingTheme.themeMode.title")}>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className={cn(
              "h-10 w-full rounded-xl border bg-background px-3 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            <option value="system">{t("settingTheme.themeMode.auto")}</option>
            <option value="light">{t("settingTheme.themeMode.light")}</option>
            <option value="dark">{t("settingTheme.themeMode.dark")}</option>
          </select>
        </Field>

        <Field label={t("settingTheme.lang.title")}>
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings({ language: e.target.value as Locales })
            }
            className={cn(
              "h-10 w-full rounded-xl border bg-background px-3 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            {localeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t("settingTheme.fontSize.title")}
          desc={t("settingTheme.fontSize.desc")}
        >
          <SliderWithInput
            min={12}
            max={18}
            value={settings.fontSize}
            onChange={(value) => setSettings({ fontSize: value })}
          />
        </Field>

        <Field
          label={t("settingTheme.primaryColor.title")}
          desc={t("settingTheme.primaryColor.desc")}
        >
          <ThemeSwatchesPrimary />
        </Field>

        <Field
          label={t("settingTheme.neutralColor.title")}
          desc={t("settingTheme.neutralColor.desc")}
        >
          <ThemeSwatchesNeutral />
        </Field>
      </Section>

      <Section title={t("settingOpenAI.title")}>
        <Field
          label={t("settingOpenAI.token.title")}
          desc={t("settingOpenAI.token.desc")}
        >
          <input
            type="password"
            value={settings.token}
            onChange={(e) => setSettings({ token: e.target.value })}
            placeholder={t("settingOpenAI.token.placeholder")}
            className={cn(
              "h-10 w-full rounded-xl border bg-background px-3 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </Field>
        <Field
          label={t("settingOpenAI.endpoint.title")}
          desc={t("settingOpenAI.endpoint.desc")}
        >
          <input
            type="text"
            value={settings.endpoint}
            onChange={(e) => setSettings({ endpoint: e.target.value })}
            placeholder={t("settingOpenAI.endpoint.placeholder")}
            className={cn(
              "h-10 w-full rounded-xl border bg-background px-3 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </Field>
      </Section>

      <Section title={t("settingChat.title")}>
        <Toggle
          checked={settings.enableHistoryCount}
          label={t("settingChat.enableHistoryCount.title")}
          onChange={(next) => setSettings({ enableHistoryCount: next })}
        />
        {settings.enableHistoryCount ? (
          <Field
            label={t("settingChat.historyCount.title")}
            desc={t("settingChat.historyCount.desc")}
          >
            <SliderWithInput
              min={0}
              max={32}
              value={settings.historyCount}
              onChange={(value) => setSettings({ historyCount: value })}
            />
          </Field>
        ) : null}

        <Toggle
          checked={settings.enableCompressThreshold}
          label={t("settingChat.enableCompressThreshold.title")}
          onChange={(next) => setSettings({ enableCompressThreshold: next })}
        />
        {settings.enableCompressThreshold ? (
          <Field
            label={t("settingChat.compressThreshold.title")}
            desc={t("settingChat.compressThreshold.desc")}
          >
            <SliderWithInput
              min={0}
              max={32}
              value={settings.compressThreshold}
              onChange={(value) => setSettings({ compressThreshold: value })}
            />
          </Field>
        ) : null}
      </Section>

      <Section title={t("settingModel.title")}>
        <Field
          label={t("settingModel.model.title")}
          desc={t("settingModel.model.desc")}
        >
          <select
            value={settings.model}
            onChange={(e) => setSettings({ model: e.target.value })}
            className={cn(
              "h-10 w-full rounded-xl border bg-background px-3 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t("settingModel.temperature.title")}
          desc={t("settingModel.temperature.desc")}
        >
          <SliderWithInput
            min={0}
            max={1}
            step={0.1}
            value={settings.temperature}
            onChange={(value) => setSettings({ temperature: value })}
          />
        </Field>

        <Field
          label={t("settingModel.topP.title")}
          desc={t("settingModel.topP.desc")}
        >
          <SliderWithInput
            min={0}
            max={1}
            step={0.1}
            value={settings.topP}
            onChange={(value) => setSettings({ topP: value })}
          />
        </Field>

        <Field
          label={t("settingModel.presencePenalty.title")}
          desc={t("settingModel.presencePenalty.desc")}
        >
          <SliderWithInput
            min={-2}
            max={2}
            step={0.1}
            value={settings.presencePenalty}
            onChange={(value) => setSettings({ presencePenalty: value })}
          />
        </Field>

        <Field
          label={t("settingModel.frequencyPenalty.title")}
          desc={t("settingModel.frequencyPenalty.desc")}
        >
          <SliderWithInput
            min={-2}
            max={2}
            step={0.1}
            value={settings.frequencyPenalty}
            onChange={(value) => setSettings({ frequencyPenalty: value })}
          />
        </Field>

        <Toggle
          checked={settings.enableMaxTokens}
          label={t("settingModel.enableMaxTokens.title")}
          onChange={(next) => setSettings({ enableMaxTokens: next })}
        />
        {settings.enableMaxTokens ? (
          <Field
            label={t("settingModel.maxTokens.title")}
            desc={t("settingModel.maxTokens.desc")}
          >
            <SliderWithInput
              min={0}
              max={32_000}
              step={100}
              value={settings.maxTokens}
              onChange={(value) => setSettings({ maxTokens: value })}
            />
          </Field>
        ) : null}
      </Section>

      <Section title={t("settingSystem.title")}>
        <Field
          label={t("settingSystem.accessCode.title")}
          desc={t("settingSystem.accessCode.desc")}
        >
          <input
            type="password"
            value={settings.accessCode}
            onChange={(e) => setSettings({ accessCode: e.target.value })}
            placeholder={t("settingSystem.accessCode.placeholder")}
            className={cn(
              "h-10 w-full rounded-xl border bg-background px-3 text-sm",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-destructive/5 px-4 py-3">
          <div className="min-w-0">
            <div className="text-sm font-medium">{t("danger.reset.title")}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {t("danger.reset.desc")}
            </div>
          </div>
          <Button type="button" variant="destructive" onClick={resetAll}>
            {t("danger.reset.action")}
          </Button>
        </div>
      </Section>
    </div>
  );
});

SettingForm.displayName = "SettingForm";

export default SettingForm;
