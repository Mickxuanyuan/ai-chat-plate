import type { OpenAIStreamPayload } from "@/types/openai";

export const runtime = "edge";

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

export async function handler(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    return new Response("Missing env var: OPENAI_API_KEY", { status: 500 });

  const { messages, ...params } = (await req.json()) as OpenAIStreamPayload;

  const response = await fetch(toChatCompletionsUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...params,
      stream: true,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return new Response(text || "OpenAI request failed", {
      status: response.status,
    });
  }

  if (!response.body) {
    return new Response("OpenAI response has no body", { status: 500 });
  }

  const stream = createTextStreamFromOpenAISSE(response.body);
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export default handler;
