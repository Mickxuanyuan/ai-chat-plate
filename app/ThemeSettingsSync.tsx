"use client";

import isEqual from "lodash-es/isEqual";
import { useEffect } from "react";

import { settingsSelectors, useSettings } from "@/store/settings";

function replacePrefixedClass(
  element: HTMLElement,
  prefix: string,
  nextKey: string,
) {
  const classes = Array.from(element.classList);
  for (const name of classes) {
    if (name.startsWith(prefix)) element.classList.remove(name);
  }

  if (nextKey) element.classList.add(`${prefix}${nextKey}`);
}

export default function ThemeSettingsSync() {
  const settings = useSettings(settingsSelectors.currentSettings, isEqual);

  useEffect(() => {
    useSettings.persist.rehydrate();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    replacePrefixedClass(root, "theme-primary-", settings.primaryColor);
    replacePrefixedClass(root, "theme-neutral-", settings.neutralColor);
  }, [settings.neutralColor, settings.primaryColor]);

  return null;
}
