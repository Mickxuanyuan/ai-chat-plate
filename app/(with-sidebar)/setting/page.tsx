"use client";

import Head from "next/head";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import Header from "./Header";
import SettingForm from "./SettingForm";

const SettingPage = memo(() => {
  const { t } = useTranslation("setting");
  const pageTitle = `${t("header")} - AIChat`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div className="flex h-dvh w-full flex-col">
        <Header />
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto w-full max-w-4xl">
            <SettingForm />
          </div>
        </div>
      </div>
    </>
  );
});

SettingPage.displayName = "SettingPage";

export default SettingPage;
