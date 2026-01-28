import { env, databaseProviders } from "@/shared/config/env";

export type DatabaseProvider = (typeof databaseProviders)[number];

export function getDatabaseProvider(): DatabaseProvider {
  return env.DATABASE_PROVIDER;
}

const CASE_INSENSITIVE_PROVIDERS = new Set<DatabaseProvider>(["postgresql", "sqlserver"]);

export function providerSupportsCaseInsensitiveFiltering(): boolean {
  return CASE_INSENSITIVE_PROVIDERS.has(getDatabaseProvider());
}
