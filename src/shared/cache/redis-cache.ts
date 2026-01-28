import Redis from "ioredis";
import { CacheAdapter } from "@/shared/cache/types";

type RedisJSON = string;

const globalForRedis = globalThis as unknown as {
  __starterRedis?: Redis;
};

function getRedisClient(redisUrl: string) {
  if (!globalForRedis.__starterRedis) {
    globalForRedis.__starterRedis = new Redis(redisUrl, {
      lazyConnect: true,
    });
  }
  return globalForRedis.__starterRedis;
}

export function createRedisCacheAdapter(redisUrl: string): CacheAdapter {
  const client = getRedisClient(redisUrl);

  return {
    async get<T>(key: string): Promise<T | null> {
      const raw = (await client.get(key)) as RedisJSON | null;
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
      await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    },
    async del(key: string): Promise<void> {
      await client.del(key);
    },
  };
}
