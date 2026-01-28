import { CacheAdapter } from "@/shared/cache/types";

type Entry = {
  value: unknown;
  expiresAt: number;
};

export function createMemoryCacheAdapter(): CacheAdapter & { clear: () => void } {
  const store = new Map<string, Entry>();

  const cleanup = (key: string, entry: Entry | undefined) => {
    if (entry && entry.expiresAt <= Date.now()) {
      store.delete(key);
      return true;
    }
    return false;
  };

  return {
    async get<T>(key: string): Promise<T | null> {
      const entry = store.get(key);
      if (!entry) return null;
      if (cleanup(key, entry)) return null;
      return entry.value as T;
    },
    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
      const expiresAt = Date.now() + ttlSeconds * 1000;
      store.set(key, { value, expiresAt });
    },
    async del(key: string): Promise<void> {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}
