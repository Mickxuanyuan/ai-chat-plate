export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpQuery = Record<
  string,
  string | number | boolean | null | undefined
>;

export type ResponseType = "json" | "text" | "blob" | "arrayBuffer";

export class HttpError<TData = unknown> extends Error {
  status: number;
  data?: TData;

  constructor(
    message: string,
    { status, data }: { status: number; data?: TData },
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

function buildUrl(path: string, query?: HttpQuery) {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

async function parseByType(response: Response, responseType: ResponseType) {
  if (responseType === "blob") return response.blob();
  if (responseType === "arrayBuffer") return response.arrayBuffer();
  if (responseType === "text") return response.text();
  return response.json();
}

async function parseErrorData(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return response.json();
  return response.text();
}

async function request<TResponse, TErrorData = unknown>({
  method,
  path,
  query,
  body,
  headers,
  signal,
  responseType = "json",
}: {
  method: HttpMethod;
  path: string;
  query?: HttpQuery;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  responseType?: ResponseType;
}): Promise<TResponse> {
  const url = buildUrl(path, query);
  const hasBody = body !== undefined;

  const response = await fetch(url, {
    method,
    headers: {
      ...(hasBody ? { "content-type": "application/json" } : {}),
      ...headers,
    },
    body: hasBody ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    const data = (await parseErrorData(response)) as TErrorData;
    throw new HttpError(`Request failed: ${response.status}`, {
      status: response.status,
      data,
    });
  }

  return (await parseByType(response, responseType)) as TResponse;
}

export const http = {
  request,

  get: <TResponse, TErrorData = unknown>(
    path: string,
    options?: {
      query?: HttpQuery;
      headers?: HeadersInit;
      signal?: AbortSignal;
      responseType?: ResponseType;
    },
  ) =>
    request<TResponse, TErrorData>({
      method: "GET",
      path,
      query: options?.query,
      headers: options?.headers,
      signal: options?.signal,
      responseType: options?.responseType,
    }),

  post: <TResponse, TErrorData = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: {
      query?: HttpQuery;
      headers?: HeadersInit;
      signal?: AbortSignal;
      responseType?: ResponseType;
    },
  ) =>
    request<TResponse, TErrorData>({
      method: "POST",
      path,
      query: options?.query,
      body,
      headers: options?.headers,
      signal: options?.signal,
      responseType: options?.responseType,
    }),

  download: async (args: {
    path: string;
    query?: HttpQuery;
    filename?: string;
    signal?: AbortSignal;
  }) => {
    const blob = await request<Blob>({
      method: "GET",
      path: args.path,
      query: args.query,
      signal: args.signal,
      responseType: "blob",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = args.filename ?? "download";
    link.click();
    URL.revokeObjectURL(url);
  },
};
