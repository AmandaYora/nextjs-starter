import { describe, expect, it } from "vitest";
import { buildQueryString, mergeQueryParams } from "@/shared/lib/query-builder";

describe("query builder", () => {
  it("builds query strings", () => {
    const query = buildQueryString({ page: 2, q: "abc" });
    expect(query).toEqual("?page=2&q=abc");
  });

  it("merges query params", () => {
    const current = new URLSearchParams("page=1&q=joe");
    const merged = mergeQueryParams(current, { page: 2, q: null });
    expect(merged.get("page")).toBe("2");
    expect(merged.get("q")).toBeNull();
  });
});
