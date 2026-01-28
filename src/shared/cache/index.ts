import { env } from "@/shared/config/env";
import { CacheAdapter } from "@/shared/cache/types";
import { createMemoryCacheAdapter } from "@/shared/cache/memory-cache";
import { createRedisCacheAdapter } from "@/shared/cache/redis-cache";
import { logger } from "@/shared/lib/logger";

let adapter: CacheAdapter;

const memoryAdapter = createMemoryCacheAdapter();
const isProduction = process.env.NODE_ENV === "production";

if (env.REDIS_URL) {
  adapter = createRedisCacheAdapter(env.REDIS_URL);
} else {
  if (isProduction) {
    if (env.REQUIRE_DISTRIBUTED_CACHE) {
      throw new Error(
        "REDIS_URL is required in production when REQUIRE_DISTRIBUTED_CACHE is enabled.",
      );
    }
    logger.warn("distributed-cache-disabled", {
      message: "REDIS_URL missing in production; falling back to in-memory cache.",
    });
  }
  adapter = memoryAdapter;
}

export async function getCache<T>(key: string): Promise<T | null> {
  return adapter.get<T>(key);
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number) {
  if (ttlSeconds <= 0) return;
  await adapter.set(key, value, ttlSeconds);
}

export async function deleteCache(key: string) {
  await adapter.del(key);
}

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }
  const value = await loader();
  await setCache(key, value, ttlSeconds);
  return value;
}

export function __setCacheAdapterForTests(testAdapter: CacheAdapter) {
  adapter = testAdapter;
}

export { createMemoryCacheAdapter } from "@/shared/cache/memory-cache";
