import { memo, type PropsWithChildren, useEffect } from "react";

import { createI18nNext } from "@/locales/create";
import { useSettings } from "@/store/settings";

const initI18n = createI18nNext();

const ChatLayout = memo<PropsWithChildren>(({ children }) => {
  useEffect(() => {
    initI18n.finally();
  }, []);

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
