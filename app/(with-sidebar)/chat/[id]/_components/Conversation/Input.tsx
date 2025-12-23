"use client";

import { encode } from "gpt-tokenizer";
import {
  ChevronDown,
  ChevronUp,
  Eraser,
  Languages,
  SendHorizonal,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/_components/ui/button";
import { ModelTokens } from "@/const/modelTokens";
import {
  agentSelectors,
  chatSelectors,
  useSessionStore,
} from "@/store/session";
import { useSettings } from "@/store/settings";
import { cn } from "@/utils/tools";

const ChatInput = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [text, setText] = useState("");
  const textTokenCount = useMemo(() => encode(text).length, [text]);

  const [inputHeight] = useSettings((s) => [s.inputHeight], shallow);
  const [totalToken, model, sendMessage, clearMessage] = useSessionStore(
    (s) => [
      chatSelectors.totalTokenCount(s),
      agentSelectors.currentAgentModel(s),
      s.createOrSendMsg,
      s.clearMessage,
    ],
    shallow,
  );

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const nextHeight = entry?.contentRect?.height;
      if (!nextHeight) return;
      useSettings.setState({ inputHeight: Math.round(nextHeight) });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maxTokens = ModelTokens[model];
  const currentTokens = totalToken + textTokenCount;
  const isOverTokens =
    typeof maxTokens === "number" ? currentTokens > maxTokens : false;

  const send = useCallback(async () => {
    const content = text.trim();
    if (!content) return;
    await sendMessage(content);
    setText("");
  }, [sendMessage, text]);

  return (
    <div className="sticky bottom-0 z-10 border-t bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 p-3">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (e.shiftKey) return;
              e.preventDefault();
              void send();
            }}
            className={cn(
              "min-h-[120px] w-full resize-y rounded-xl border bg-background px-3 py-2 text-sm outline-none",
              "focus-visible:ring-ring focus-visible:ring-2",
            )}
            style={{
              height: isExpanded
                ? Math.max(200, inputHeight ?? 200)
                : inputHeight,
            }}
            placeholder="输入消息，Enter 发送，Shift+Enter 换行"
          />

          <div className="absolute right-2 top-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isExpanded ? "Collapse" : "Expand"}
              className="h-8 w-8 rounded-full"
              onClick={() => setIsExpanded((v) => !v)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              aria-label="Translate"
            >
              <Languages className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              aria-label="Clear"
              onClick={() => {
                clearMessage();
                setText("");
              }}
            >
              <Eraser className="h-4 w-4" />
            </Button>

            <div
              className={cn(
                "ml-1 rounded-full border px-2 py-1 text-xs tabular-nums text-muted-foreground",
                isOverTokens && "border-destructive/40 text-destructive",
              )}
              title="Token count"
            >
              {typeof maxTokens === "number"
                ? `${currentTokens}/${maxTokens}`
                : currentTokens}
            </div>
          </div>

          <Button
            type="button"
            className="h-9 rounded-full"
            onClick={() => void send()}
            disabled={!text.trim() || isOverTokens}
          >
            <SendHorizonal className="mr-2 h-4 w-4" />
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatInput);
