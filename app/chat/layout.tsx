import { memo, type PropsWithChildren, useEffect } from "react";

import { createI18nNext } from "@/locales/create";
import { useSettings } from "@/store/settings";
import { useRouter } from "next/router";

const initI18n = createI18nNext();

const ChatLayout = memo<PropsWithChildren>(({ children }) => {
  useEffect(() => {
    initI18n.finally();
  }, []);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const hasRehydrated = useSessionStore.persist.hasHydrated();
    // 只有当水合完毕后，才能正常去激活会话
    if (typeof id === 'string' && hasRehydrated) {
      activeSession(id);
    }
  }, [id]);

  useEffect(() => {
    const hasRehydrated = useSettings.persist.hasHydrated();
    if (hasRehydrated) {
      useSettings.setState({ sidebarKey: "chat" });
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      {children}
    </div>
  );
});

export default ChatLayout;
