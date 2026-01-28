import { describe, expect, it, vi, beforeEach } from "vitest";
import { ZodError, z } from "zod";
import { AppError, handleServerError, extractFieldErrors } from "@/shared/lib/server-error";
import { logger } from "@/shared/lib/logger";

vi.mock("@/shared/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

describe("server-error helpers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("exposes public message when AppError is marked as public", () => {
    const error = new AppError("known error", { isPublic: true });
    const result = handleServerError({ error, context: "test" });
    expect(result.message).toBe("known error");
    expect(logger.error).toHaveBeenCalled();
    expect(result.requestId).toBeDefined();
  });

  it("falls back to default message for unknown errors", () => {
    const result = handleServerError({ error: new Error("boom"), context: "test" });
    expect(result.message).toBe("Unable to process your request.");
  });

  it("extracts zod field errors", () => {
    const schema = z.object({ name: z.string() });
    const parsed = schema.safeParse({ name: 123 });
    expect(parsed.success).toBe(false);
    const errors = extractFieldErrors(parsed.error as ZodError);
    expect(errors?.name?.[0]).toBeDefined();
  });
});
