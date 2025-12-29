import type { LangChainParams } from "@/types/langchain";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function getOpenAIBaseUrl() {
  const base =
    process.env.OPENAI_BASE_URL ??
    process.env.OPENAI_PROXY_URL ??
    "https://api.openai.com/v1";

  return normalizeBaseUrl(base);
}

function toChatCompletionsUrl() {
  const base = getOpenAIBaseUrl();
  return base.endsWith("/v1")
    ? `${base}/chat/completions`
    : `${base}/v1/chat/completions`;
}

function createTextStreamFromOpenAISSE(sseStream: ReadableStream<Uint8Array>) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = sseStream.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice("data:".length).trim();
            if (!data) continue;
            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const token = json.choices?.[0]?.delta?.content;
              if (!token) continue;
              controller.enqueue(encoder.encode(token));
            } catch {
              // ignore invalid JSON chunks
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }

      controller.close();
    },
  });
}

export function LangChainStream(payload: LangChainParams) {
  const { prompts, vars, llm } = payload;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new ReadableStream<Uint8Array>({
      start(controller) {
        controller.error(new Error("Missing env var: OPENAI_API_KEY"));
      },
    });
  }

  const compile = (template: string) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => {
      const value = vars?.[key];
      return value === undefined || value === null ? "" : String(value);
    });

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = await fetch(toChatCompletionsUrl(), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...llm,
            stream: true,
            messages: prompts.map((m) => ({
              role: m.role,
              content: compile(m.content),
            })),
          }),
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          controller.error(
            new Error(text || `OpenAI request failed (${response.status})`),
          );
          return;
        }

        if (!response.body) {
          controller.error(new Error("OpenAI response has no body"));
          return;
        }

        const textStream = createTextStreamFromOpenAISSE(response.body);
        const reader = textStream.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) controller.enqueue(value);
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
