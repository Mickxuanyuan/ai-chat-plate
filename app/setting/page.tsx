"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/app/_components/ui/button";
import { useSettings } from "@/store/settings";

export default function SettingPage() {
  const router = useRouter();

  useEffect(() => {
    useSettings.persist.rehydrate();
  }, []);

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 p-6">
      <div className="text-sm font-medium">Settings</div>
      <div className="text-sm text-muted-foreground">设置页开发中。</div>
      <Button type="button" variant="secondary" onClick={() => router.push("/chat")}>
        返回聊天
      </Button>
    </main>
  );
}
