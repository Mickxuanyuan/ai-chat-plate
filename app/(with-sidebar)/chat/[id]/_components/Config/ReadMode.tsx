"use client";

import { LucideBrain, LucideThermometer, WholeWord } from "lucide-react";
import { memo } from "react";
import { shallow } from "zustand/shallow";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import {
  agentSelectors,
  sessionSelectors,
  useSessionStore,
} from "@/store/session";
import { DEFAULT_TITLE } from "@/store/session/slices/agentConfig";
import { cn } from "@/utils/tools";

import { ConfigCell, ConfigCellGroup } from "./ConfigCell";
import isEqual from "lodash-es/isEqual";

const ReadMode = memo(() => {
  const session = useSessionStore(sessionSelectors.currentSessionSafe, isEqual);
  const avatar = useSessionStore(agentSelectors.currentAgentAvatar, shallow);
  const title = useSessionStore(agentSelectors.currentAgentTitle, shallow);
  const model = useSessionStore(agentSelectors.currentAgentModel, shallow);

  const avatarSrc =
    typeof avatar === "string" && /^(https?:\/\/|\/)/.test(avatar)
      ? avatar
      : undefined;
  const avatarFallback =
    typeof avatar === "string" && avatar && !avatarSrc
      ? avatar
      : (title ?? "A").slice(0, 1);

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-8">
      <Avatar className="h-[100px] w-[100px]">
        {avatarSrc ? (
          <AvatarImage alt={title ?? "avatar"} src={avatarSrc} />
        ) : null}
        <AvatarFallback className={cn("text-xl")}>
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <div className="text-center text-base font-semibold">
        {title || DEFAULT_TITLE}
      </div>
      <div className="text-center text-sm text-muted-foreground">{model}</div>
      <div className="max-w-[240px] text-center text-sm text-foreground/80">
        {session.meta.description}
      </div>

      <div className="mt-2 flex w-full flex-1 flex-col gap-3">
        <ConfigCell icon={LucideBrain} label={"提示词"} />

        <ConfigCellGroup
          items={[
            {
              icon: LucideThermometer,
              label: "温度",
              value: session.config.params.temperature,
            },
            {
              icon: WholeWord,
              label: "会话最大长度",
              value: session.config.params.max_tokens,
            },
          ]}
        />
      </div>
    </div>
  );
});

export default ReadMode;
