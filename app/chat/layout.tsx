"use client";

import { memo, type PropsWithChildren, useEffect } from "react";

import AvatarWithUpload from "@/features/AvatarWithUpload";
import { Button } from "@/app/_components/ui/button";
import { createI18nNext } from "@/locales/create";
import { useSettings } from "@/store/settings";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/store/session";
import { sessionSelectors } from "@/store/session";
import { shallow } from "zustand/shallow";
import SideBar from "@/app/_components/SideBar";
import { MessageSquare, Settings2, Sticker } from "lucide-react";
import { SidebarTabKey } from "@/store/settings/initialState";

const initI18n = createI18nNext();

const ChatLayout = memo<PropsWithChildren>(({ children }) => {
  useEffect(() => {
    initI18n.finally();
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [activeSession] = useSessionStore((s) => {
    return [s.activeSession];
  }, shallow);

  const [chatList, activeId, createSession] = useSessionStore(
    (s) => [sessionSelectors.chatList(s), s.activeId, s.createSession],
    shallow,
  );

  const [tab, setTab] = useSettings(
    (s) => [s.sidebarKey, s.switchSideBar],
    shallow,
  );

  useEffect(() => {
    // persist 设置了 `skipHydration: true`，需要手动触发 rehydrate
    // 同时：Chat 页面默认展示 chat tab（不依赖上次持久化的 tab）
    (async () => {
      await useSessionStore.persist.rehydrate();
      await useSettings.persist.rehydrate();

      useSettings.setState({ sidebarKey: "chat" });

      // 只有当水合完毕后，才能正常去激活会话
      if (typeof id === "string") {
        activeSession(id);
      }
    })();
  }, [id, activeSession]);

  return (
    <div className="flex w-full">
      <SideBar
        avatar={<AvatarWithUpload />}
        items={[
          { key: "chat", label: "Chat", icon: MessageSquare },
          { key: "market", label: "Market", icon: Sticker },
        ]}
        activeKey={tab}
        onTabChange={(key: string) => setTab(key as SidebarTabKey)}
        bottomActions={[
          {
            label: "Settings",
            icon: Settings2,
            onClick: () => router.push("/setting"),
          },
        ]}
      />

      {tab === "chat" ? (
        <aside className="flex h-screen w-80 shrink-0 flex-col border-r bg-background">
          <div className="flex items-center justify-between gap-2 border-b p-3">
            <div className="text-sm font-medium">会话</div>
            <Button
              size="sm"
              variant="secondary"
              type="button"
              onClick={async () => {
                const newId = await createSession();
                router.push(`/chat?id=${newId}`);
              }}
            >
              新建
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <div className="flex flex-col gap-1">
              {chatList.map((session) => {
                const isActive = session.id === activeId;
                const title = session.meta?.title?.trim() || "未命名会话";
                const description = session.meta?.description?.trim();
                return (
                  <button
                    key={session.id}
                    type="button"
                    className={[
                      "flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                    ].join(" ")}
                    onClick={async () => {
                      activeSession(session.id);
                      router.push(`/chat?id=${session.id}`);
                    }}
                  >
                    <div className="line-clamp-1 font-medium">{title}</div>
                    {description ? (
                      <div className="line-clamp-1 text-xs text-muted-foreground">
                        {description}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      ) : null}

      {children}
    </div>
  );
});

export default ChatLayout;
