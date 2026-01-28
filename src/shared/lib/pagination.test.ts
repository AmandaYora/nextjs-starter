import { describe, expect, it } from "vitest";
import { getPaginationMeta, normalizePagination } from "@/shared/lib/pagination";

describe("pagination helpers", () => {
  it("normalizes invalid values", () => {
    const result = normalizePagination({ page: -2, pageSize: 500 });
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(50);
    expect(result.skip).toBe(0);
    expect(result.take).toBe(50);
  });

  it("computes meta data", () => {
    const meta = getPaginationMeta({ total: 45, page: 2, pageSize: 10 });
    expect(meta.totalPages).toBe(5);
  });
});
