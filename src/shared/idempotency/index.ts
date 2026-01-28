export function getIdempotencyKey(
  headers: Headers | Record<string, string | undefined>,
): string | undefined {
  if (headers instanceof Headers) {
    return headers.get("Idempotency-Key") ?? headers.get("idempotency-key") ?? undefined;
  }

  const entries = Object.entries(headers ?? {});
  for (const [key, value] of entries) {
    if (key.toLowerCase() === "idempotency-key") {
      return value;
    }
  }
  return undefined;
}

export function ensureRequestId(
  headers: Record<string, string | undefined>,
  fallbackId?: string,
): string {
  const existing = headers["x-request-id"] ?? headers["X-Request-Id"];
  if (existing) {
    return existing;
  }
  const generated = fallbackId ?? crypto.randomUUID();
  headers["x-request-id"] = generated;
  return generated;
}
