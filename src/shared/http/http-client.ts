export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

export type HttpRequestConfig = {
  method?: HttpMethod;
  url: string;
  baseURL?: string;
  headers?: Record<string, string | undefined>;
  params?: Record<string, string | number | undefined>;
  data?: unknown;
  timeoutMs?: number;
  idempotencyKey?: string;
  requestId?: string;
};

export type HttpResponse<T> = {
  data: T;
  status: number;
  headers: Record<string, string>;
  requestId?: string;
};

export interface HttpClient {
  request<T = unknown>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
}

export class HttpError extends Error {
  status?: number;
  code?: string;
  requestId?: string;
  response?: HttpResponse<unknown>;

  constructor(message: string, options?: Partial<HttpError>) {
    super(message);
    this.name = "HttpError";
    Object.assign(this, options);
  }
}

export function buildUrl(baseURL: string | undefined, url: string) {
  if (!baseURL || /^https?:\/\//i.test(url)) {
    return url;
  }
  return `${baseURL.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}
