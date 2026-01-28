import { httpDefaults } from "@/shared/config/env";
import { HttpClient, HttpRequestConfig, HttpResponse, HttpError, buildUrl } from "@/shared/http/http-client";

type FetchHttpClientOptions = {
  baseURL?: string;
  timeoutMs?: number;
};

export function createFetchHttpClient(options: FetchHttpClientOptions = {}): HttpClient {
  const baseURL = options.baseURL ?? httpDefaults.baseURL;
  const timeoutMs = options.timeoutMs ?? httpDefaults.timeoutMs;

  return {
    async request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
      const method = config.method ?? "GET";
      const headers = {
        ...(config.headers ?? {}),
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs ?? timeoutMs);

      try {
        const response = await fetch(buildUrl(config.baseURL ?? baseURL, config.url), {
          method,
          headers,
          body: config.data ? JSON.stringify(config.data) : undefined,
          signal: controller.signal,
        });

        const text = await response.text();
        const data = text ? (JSON.parse(text) as T) : (undefined as T);
        const normalizedHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          normalizedHeaders[key] = value;
        });

        if (!response.ok) {
          throw new HttpError("Request failed", {
            status: response.status,
            response: { data, headers: normalizedHeaders, status: response.status },
          });
        }

        return {
          data,
          status: response.status,
          headers: normalizedHeaders,
        };
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(
          error instanceof Error ? error.message : "Unable to complete request",
        );
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
