"use client";

import { useParams } from "next/navigation";
import { memo, type PropsWithChildren, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import DraggablePanelLayout from "@/app/_components/DraggablePanel/components/DraggablePanelLayout";
import { useSessionStore } from "@/store/session";

import { Sessions } from "./_components/SessionList";

const ChatLayout = memo<PropsWithChildren>(({ children }) => {
  const params = useParams<{ id?: string | string[] }>();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [activeSession] = useSessionStore((s) => {
    return [s.activeSession];
  }, shallow);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    (async () => {
      await useSessionStore.persist.rehydrate();

      // 只有当水合完毕后，才能正常去激活会话
      if (typeof id === "string" && id) {
        activeSession(id);
      }
    })();
  }, [activeSession, id]);

  // `react-resizable-panels` 会生成运行时 id/data-testid；SSR/CSR 可能出现不一致，导致 hydration mismatch。
  // 这里仅在客户端挂载后再渲染 Resizable 布局，避免水合属性不匹配。
  if (!mounted) {
    return <div className="h-dvh w-full">{children}</div>;
  }

  return (
    <div className="h-dvh w-full">
      <DraggablePanelLayout
        content={<div className="h-full w-full">{children}</div>}
        defaultPanelSize={26}
        maxPanelSize={60}
        minPanelSize={18}
        panel={<Sessions />}
        panelProps={{
          defaultExpand: true,
          destroyOnClose: false,
          placement: "left",
        }}
        withHandle
      />
    </div>
  );
});

export default ChatLayout;
