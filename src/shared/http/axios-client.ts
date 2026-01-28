import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { httpDefaults } from "@/shared/config/env";
import {
  HttpClient,
  HttpError,
  HttpRequestConfig,
  HttpResponse,
  buildUrl,
} from "@/shared/http/http-client";
import { ensureRequestId, getIdempotencyKey } from "@/shared/idempotency";

type AxiosHttpClientOptions = {
  baseURL?: string;
  timeoutMs?: number;
  maxRetries?: number;
  axiosInstance?: AxiosInstance;
};

const RETRYABLE_METHODS = new Set(["GET", "HEAD"]);

function shouldRetry(config: AxiosRequestConfig, attempt: number, maxRetries: number) {
  if (attempt >= maxRetries) {
    return false;
  }
  const method = (config.method ?? "get").toUpperCase();
  if (RETRYABLE_METHODS.has(method)) {
    return true;
  }
  const headers = config.headers ?? {};
  const idempotencyKey = getIdempotencyKey(
    Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
    ),
  );
  return Boolean(idempotencyKey);
}

function normalizeHeaders(
  headers: Record<string, string | number | boolean> | undefined,
): Record<string, string> {
  if (!headers) return {};
  const normalized: Record<string, string> = {};
  Object.entries(headers).forEach(([key, value]) => {
    normalized[key.toLowerCase()] = String(value);
  });
  return normalized;
}

function toHttpError(error: unknown): HttpError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const headers = normalizeHeaders(axiosError.response?.headers as Record<string, string>);
    const requestId = headers["x-request-id"];
    const data = axiosError.response?.data;
    return new HttpError(axiosError.message, {
      status,
      code: axiosError.code,
      requestId,
      response:
        status !== undefined
          ? {
              data,
              status,
              headers,
              requestId,
            }
          : undefined,
    });
  }
  return new HttpError(error instanceof Error ? error.message : "Request failed");
}

export function createAxiosHttpClient(options: AxiosHttpClientOptions = {}): HttpClient {
  const baseURL = options.baseURL ?? httpDefaults.baseURL;
  const timeout = options.timeoutMs ?? httpDefaults.timeoutMs;
  const maxRetries = options.maxRetries ?? 1;
  const instance =
    options.axiosInstance ??
    axios.create({
      baseURL,
      timeout,
    });

  return {
    async request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
      const headers = { ...(config.headers ?? {}) };
      const requestId = ensureRequestId(headers, config.requestId);
      const axiosConfig: AxiosRequestConfig = {
        method: config.method ?? "GET",
        url: buildUrl(config.baseURL ?? baseURL, config.url),
        headers,
        params: config.params,
        data: config.data,
        timeout: config.timeoutMs ?? timeout,
      };

      let lastError: unknown;

      for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        try {
          const response = await instance.request<T>(axiosConfig);
          return {
            data: response.data,
            status: response.status,
            headers: normalizeHeaders(response.headers as Record<string, string>),
            requestId: response.headers?.["x-request-id"] as string | undefined,
          };
        } catch (error) {
          lastError = error;
          if (!shouldRetry(axiosConfig, attempt, maxRetries)) {
            break;
          }
        }
      }

      throw toHttpError(lastError);
    },
  };
}
