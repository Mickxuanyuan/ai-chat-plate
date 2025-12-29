import { handler as chainHandler } from "../chain.api";
import { handler as openaiHandler } from "../openai.api";

export const runtime = "edge";

export async function POST(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await context.params;
  const route = (path ?? []).join("/");

  switch (route) {
    case "openai":
    case "openai-dev":
      return openaiHandler(request);
    case "chain":
    case "chain-dev":
      return chainHandler(request);
    default:
      return new Response("Not Found", { status: 404 });
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
