"use client";

import { useRouter } from "next/navigation";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { sessionSelectors, useSessionStore } from "@/store/session";

import Header from "./_components/Header";
import Head from "next/head";
import Conversation from "./_components/Conversation";

const Chat = memo(() => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [meta, id, toggleConfig] = useSessionStore((s) => {
    const session = sessionSelectors.currentSession(s);
    return [session?.meta, s.activeId, s.toggleConfig];
  }, shallow);

  const pageTitle = meta?.title ? `${meta.title} - AIChat` : "AIChat";

  return (
    <div className="flex h-full w-full flex-col">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header
        avatar={meta && sessionSelectors.getAgentAvatar(meta)}
        avatarBackground={meta?.backgroundColor}
        description={meta?.description || t("noDescription")}
        title={meta?.title || t("defaultAgent")}
        onEdit={() => {
          if (!id) return;
          router.push(`/chat/${id}/edit`);
        }}
        onShare={() => {
          // TODO: share logic
        }}
        onArchive={() => {
          // TODO: archive logic
        }}
        onToggleSettings={() => toggleConfig()}
      />
      <div
        id={'lobe-conversion-container'}
        style={{ height: 'calc(100vh - 64px)', position: 'relative' }}
      >
        <Conversation />
        {/* <Config /> */}
      </div>
    </div>
  );
});

Chat.displayName = "Chat";

export default Chat;
