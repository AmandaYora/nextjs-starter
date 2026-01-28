import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAxiosHttpClient } from "@/shared/http/axios-client";
import { HttpError } from "@/shared/http/http-client";

const mockRequest = vi.fn();

vi.mock("axios", () => {
  const mockCreate = vi.fn(() => ({
    request: mockRequest,
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  }));

  const isAxiosError = (error: unknown) =>
    Boolean(error && typeof error === "object" && (error as { isAxiosError?: boolean }).isAxiosError);

  return {
    default: {
      create: mockCreate,
      isAxiosError,
    },
    create: mockCreate,
    isAxiosError,
  };
});

describe("createAxiosHttpClient", () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  it("maps axios errors to HttpError with status, code, and requestId", async () => {
    const client = createAxiosHttpClient({ maxRetries: 0 });
    mockRequest.mockRejectedValueOnce({
      isAxiosError: true,
      message: "Server exploded",
      code: "ERR_BAD_RESPONSE",
      response: {
        status: 500,
        data: { message: "boom" },
        headers: { "x-request-id": "req-123" },
      },
    });

    await expect(client.request({ url: "/test" })).rejects.toMatchObject({
      status: 500,
      code: "ERR_BAD_RESPONSE",
      requestId: "req-123",
      name: "HttpError",
    });
  });

  it("does not retry non-idempotent requests without an idempotency key", async () => {
    const client = createAxiosHttpClient({ maxRetries: 2 });
    mockRequest.mockRejectedValue({
      isAxiosError: true,
      message: "fail",
    });

    await expect(client.request({ url: "/test", method: "POST" })).rejects.toBeInstanceOf(HttpError);
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });
});
