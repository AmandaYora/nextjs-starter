import { randomUUID } from "crypto";
import { ZodError } from "zod";
import { logger } from "@/shared/lib/logger";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
  requestId?: string;
};

export class AppError extends Error {
  statusCode: number;
  isPublic: boolean;

  constructor(message: string, options?: { statusCode?: number; isPublic?: boolean }) {
    super(message);
    this.name = "AppError";
    this.statusCode = options?.statusCode ?? 500;
    this.isPublic = options?.isPublic ?? false;
  }
}

export function extractFieldErrors(error: unknown) {
  if (error instanceof ZodError) {
    return error.flatten().fieldErrors;
  }
  return undefined;
}

export function handleServerError({
  error,
  context,
  fallbackMessage = "Unable to process your request.",
}: {
  error: unknown;
  context: string;
  fallbackMessage?: string;
}): ActionState {
  const fieldErrors = extractFieldErrors(error);
  const isPublic = error instanceof AppError && error.isPublic;
  const requestId = randomUUID();

  if (!fieldErrors) {
    logger.error(context, {
      requestId,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  return {
    status: "error",
    message: isPublic ? (error as Error).message : fallbackMessage,
    fieldErrors,
    requestId,
  };
}

export function successState(message: string): ActionState {
  return {
    status: "success",
    message,
  };
}
