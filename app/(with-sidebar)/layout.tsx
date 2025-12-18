"use client";

import { MessageSquare, Settings2, Sticker } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { memo, type PropsWithChildren, useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";

import SideBar from "@/app/_components/SideBar";
import AvatarWithUpload from "@/features/AvatarWithUpload";
import { createI18nNext } from "@/locales/create";
import { useSettings } from "@/store/settings";
import type { SidebarTabKey } from "@/store/settings/initialState";

const initI18n = createI18nNext();

const WithSidebarLayout = memo<PropsWithChildren>(({ children }) => {
  useEffect(() => {
    initI18n.finally();
  }, []);

  useEffect(() => {
    useSettings.persist.rehydrate();
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  const routeTab = useMemo<SidebarTabKey | undefined>(() => {
    if (pathname?.startsWith("/market")) return "market";
    if (pathname?.startsWith("/chat")) return "chat";
    return undefined;
  }, [pathname]);

  const [tab, setTab] = useSettings(
    (s) => [s.sidebarKey, s.switchSideBar],
    shallow,
  );

  useEffect(() => {
    if (routeTab) {
      useSettings.setState({ sidebarKey: routeTab });
    }
  }, [routeTab]);

  return (
    <div className="flex min-h-screen w-full">
      <SideBar
        avatar={<AvatarWithUpload />}
        items={[
          { key: "chat", label: "Chat", icon: MessageSquare },
          { key: "market", label: "Market", icon: Sticker },
        ]}
        activeKey={tab}
        onTabChange={(key: string) => {
          setTab(key as SidebarTabKey);
          router.push(key === "market" ? "/market" : "/chat");
        }}
        bottomActions={[
          {
            label: "Settings",
            icon: Settings2,
            onClick: () => router.push("/setting"),
          },
        ]}
      />

      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
});

export default WithSidebarLayout;
