"use client";

import { useSearchParams } from "next/navigation";
import { memo, type PropsWithChildren, useEffect } from "react";
import { shallow } from "zustand/shallow";

import { useSessionStore } from "@/store/session";

const ChatLayout = memo<PropsWithChildren>(({ children }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [activeSession] = useSessionStore((s) => {
    return [s.activeSession];
  }, shallow);

  useEffect(() => {
    (async () => {
      await useSessionStore.persist.rehydrate();

      // 只有当水合完毕后，才能正常去激活会话
      if (typeof id === "string") {
        activeSession(id);
      }
    })();
  }, [id]);

  return <div className="flex">
    <Sessions />
    {children}
  </div>;
});

export default ChatLayout;
