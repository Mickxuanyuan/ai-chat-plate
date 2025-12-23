"use client";

import { MessageSquarePlus, Search } from "lucide-react";
import Link from "next/link";
import { memo, useId } from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/_components/ui/button";
import { useSessionStore } from "@/store/session";
import { cn } from "@/utils/tools";

const Header = memo(() => {
  const { t } = useTranslation("common");
  const inputId = useId();

  const [keywords, createSession] = useSessionStore(
    (s) => [s.searchKeywords, s.createSession],
    shallow,
  );

  return (
    <div className="shrink-0 space-y-3 border-b p-4">
      <div className="flex items-center justify-between gap-2">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          AI-Chat
        </Link>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8"
          aria-label={t("newAgent")}
          onClick={createSession}
        >
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          {t("searchAgentPlaceholder")}
        </label>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={inputId}
          className={cn(
            "h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background",
            "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
          placeholder={t("searchAgentPlaceholder")}
          value={keywords}
          onChange={(e) =>
            useSessionStore.setState({ searchKeywords: e.target.value })
          }
        />
      </div>
    </div>
  );
});

Header.displayName = "SessionListHeader";

export default Header;
