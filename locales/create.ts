import i18n from "i18next";
import { isArray } from "lodash-es";
import { initReactI18next } from "react-i18next";

import type { Namespaces } from "./resources";

import resources from "./resources";

export const createI18nNext = (namespace?: Namespaces[] | Namespaces) => {
  const ns: Namespaces[] = namespace
    ? isArray(namespace)
      ? ["common", ...namespace]
      : ["common", namespace]
    : ["common"];
  return i18n.use(initReactI18next).init({
    debug: process.env.NODE_ENV === "development",
    defaultNS: ns,
    fallbackLng: "zh-CN",
    initImmediate: false,
    interpolation: {
      escapeValue: false,
    },
    lng: "zh-CN",
    ns,
    resources,
    supportedLngs: Object.keys(resources),
  });
};
