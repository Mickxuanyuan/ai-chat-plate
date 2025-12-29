"use client";

import { useRouter } from "next/navigation";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import ChatHeader from "@/app/_components/chat/ChatHeader";

const Header = memo(() => {
  const { t } = useTranslation("setting");
  const router = useRouter();

  return (
    <ChatHeader
      showBackButton
      onBackClick={() => router.back()}
      left={<div className="text-sm font-medium">{t("header")}</div>}
    />
  );
});

Header.displayName = "SettingHeader";

export default Header;
