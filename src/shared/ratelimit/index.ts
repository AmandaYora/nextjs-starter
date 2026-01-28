import { getCache, setCache } from "@/shared/cache";

const DEFAULT_WINDOW_MS = 5 * 60 * 1000;
const DEFAULT_LIMIT = 5;

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type RateLimitState = {
  count: number;
  expiresAt: number;
};

export function buildRateLimitKey(parts: { namespace: string; identifier: string }) {
  return `ratelimit:${parts.namespace}:${parts.identifier}`;
}

export async function consumeRateLimit(
  key: string,
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
): Promise<RateLimitResult> {
  const now = Date.now();
  const state = (await getCache<RateLimitState>(key)) ?? {
    count: 0,
    expiresAt: now + windowMs,
  };

  if (state.expiresAt <= now) {
    state.count = 0;
    state.expiresAt = now + windowMs;
  }

  if (state.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: state.expiresAt,
    };
  }

  state.count += 1;
  const ttlSeconds = Math.max(1, Math.ceil((state.expiresAt - now) / 1000));
  await setCache(key, state, ttlSeconds);

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - state.count),
    reset: state.expiresAt,
  };
}
