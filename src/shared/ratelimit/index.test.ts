import { describe, expect, it, beforeEach } from "vitest";
import {
  __setCacheAdapterForTests,
  createMemoryCacheAdapter,
} from "@/shared/cache";
import { buildRateLimitKey, consumeRateLimit } from "@/shared/ratelimit";

describe("consumeRateLimit", () => {
  beforeEach(() => {
    __setCacheAdapterForTests(createMemoryCacheAdapter());
  });

  it("limits attempts after threshold using in-memory cache", async () => {
    const key = buildRateLimitKey({ namespace: "test", identifier: "user" });
    for (let i = 0; i < 5; i += 1) {
      const result = await consumeRateLimit(key, 5, 1000);
      expect(result.success).toBe(true);
    }
    const blocked = await consumeRateLimit(key, 5, 1000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
