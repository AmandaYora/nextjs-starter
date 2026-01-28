"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { CredentialsSignin } from "next-auth";
import { DASHBOARD_ROUTE } from "@/shared/constants/routes";
import { handleServerError, successState } from "@/shared/lib/server-error";
import type { ActionState } from "@/shared/types/actions";
import { credentialsSchema, type CredentialsInput } from "@/features/auth/schemas";
import { signIn } from "@/features/auth/server/auth";
import { buildRateLimitKey, consumeRateLimit } from "@/shared/ratelimit";

const RATE_LIMIT_MESSAGE = "Too many attempts. Please try again shortly.";
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

async function getClientIdentifier(email: unknown) {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
  const normalizedEmail = typeof email === "string" ? email.toLowerCase() : "unknown";
  return `${ip}:${normalizedEmail}`;
}

export async function loginAction(input: CredentialsInput): Promise<ActionState> {
  try {
    const identifier = await getClientIdentifier(input.email);
    const key = buildRateLimitKey({ namespace: "login", identifier });
    const rateResult = await consumeRateLimit(key, RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS);
    if (!rateResult.success) {
      return {
        status: "error",
        message: RATE_LIMIT_MESSAGE,
      };
    }

    const parsed = credentialsSchema.parse(input);
    await signIn("credentials", {
      ...parsed,
      redirectTo: DASHBOARD_ROUTE,
    });

    return successState("Logging you in...");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      const cause = error.cause as CredentialsSignin | undefined;
      return {
        status: "error",
        message: cause?.code === "credentials"
          ? "Invalid credentials."
          : "Unable to sign you in.",
      };
    }

    return handleServerError({
      error,
      context: "loginAction",
      fallbackMessage: "Unable to sign you in.",
    });
  }
}
