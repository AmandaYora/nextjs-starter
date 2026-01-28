import { z } from "zod";
import { themeVariantNames } from "@/shared/config/theme";

export const databaseProviders = ["postgresql", "mysql", "sqlserver", "oracle"] as const;

const envSchema = z.object({
  DATABASE_PROVIDER: z.enum(databaseProviders, {
    errorMap: () => ({
      message: `DATABASE_PROVIDER must be one of: ${databaseProviders.join(", ")}`,
    }),
  }),
  DATABASE_URL: z.string().url(),
  THEME_VARIANT: z.enum(themeVariantNames, {
    errorMap: () => ({
      message: `THEME_VARIANT must be one of: ${themeVariantNames.join(", ")}`,
    }),
  }).default("default"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters."),
  NEXTAUTH_URL: z.string().url(),
  ENCRYPTION_KEY: z.string().min(44, "ENCRYPTION_KEY must be a base64 string for 32 bytes."),
  REDIS_URL: z
    .string()
    .optional()
    .transform((value) => (value && value.trim().length > 0 ? value : undefined))
    .pipe(z.string().url().optional()),
  REQUIRE_DISTRIBUTED_CACHE: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return false;
      return !["false", "0", "off"].includes(value.toLowerCase());
    }),
  HTTP_BASE_URL: z
    .string()
    .optional()
    .transform((value) => (value && value.trim().length > 0 ? value : undefined))
    .pipe(z.string().url().optional()),
  HTTP_TIMEOUT_MS: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(z.number().positive().optional()),
});

const processEnv = {
  DATABASE_PROVIDER: process.env.DATABASE_PROVIDER,
  DATABASE_URL: process.env.DATABASE_URL,
  THEME_VARIANT: process.env.THEME_VARIANT,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  REDIS_URL: process.env.REDIS_URL,
  REQUIRE_DISTRIBUTED_CACHE: process.env.REQUIRE_DISTRIBUTED_CACHE,
  HTTP_BASE_URL: process.env.HTTP_BASE_URL,
  HTTP_TIMEOUT_MS: process.env.HTTP_TIMEOUT_MS,
};

export const env = envSchema.parse(processEnv);

export const encryptionKey = (() => {
  const buffer = Buffer.from(env.ENCRYPTION_KEY, "base64");
  if (buffer.length !== 32) {
    throw new Error("ENCRYPTION_KEY must decode to 32 bytes for AES-256-GCM.");
  }
  return buffer;
})();

export const httpDefaults = {
  baseURL: env.HTTP_BASE_URL,
  timeoutMs: env.HTTP_TIMEOUT_MS ?? 10000,
};
