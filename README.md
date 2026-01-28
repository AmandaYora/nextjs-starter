## Starter Next.js Dashboard

A production-ready Next.js starter with clean architecture, credentials-based auth, Prisma/PostgreSQL, shadcn/ui, and batteries-included DX.

### Highlights

- **Next.js App Router + Server Actions** with strict TypeScript.
- **NextAuth (Auth.js)** credentials provider with bcrypt hashing + secure middleware routing.
- **Prisma + PostgreSQL** (Docker compose) with migrations and a seeded admin (`admin@example.com / Admin123!`).
- **Feature-first structure** (`src/features`, `src/shared`, `src/db`, `src/app`) to keep UI, domain, and infrastructure separated.
- **Tailwind + shadcn/ui** design system, global light/dark theme driven by `src/shared/config/theme.ts`.
- **Users Management** dashboard page: server-side pagination/search/sort, zod validation, toasts, and role-protected CRUD.
- **Utilities**: AES-256-GCM crypto helpers, pagination/query-builder, date formatting, logger, standard server action error handling.
- **Optional scaling helpers**: pluggable Redis cache/rate limiting and an HTTP client abstraction (fetch or Axios) that stay dormant unless configured.
- **Tooling**: ESLint, Prettier, Vitest, Husky + lint-staged.

### Project Structure

```
src/
  app/         Route groups: (auth)/login, (dashboard)/dashboard, api handlers, middleware
  features/
    auth/      Auth config, login server action, helpers
    users/     Schemas, queries, server actions, UI components
  shared/
    config/    env + theme tokens
    layouts/   Dashboard shell (sidebar + topbar)
    lib/       Utilities (crypto/pagination/query/error/date/logger)
    providers/ Theme provider
    ui/        shadcn-based primitives + design system helpers
  db/          Prisma client
```

### Prerequisites

- Node.js 18+ and pnpm
- Docker (for the PostgreSQL service)

### Setup

1. **Environment**

   ```bash
   cp .env.example .env
   ```

   Fill in:

   - `DATABASE_URL` (matches docker compose defaults)
   - `NEXTAUTH_SECRET` (run `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (e.g., `http://localhost:3000`)
   - `ENCRYPTION_KEY` (base64 32 bytes, e.g., `openssl rand -base64 32`)
   - `DATABASE_PROVIDER` + provider-specific `DATABASE_URL` (see Database Portability below).
   - *(Optional)* `REDIS_URL` for shared cache/rate limiting and `HTTP_BASE_URL` / `HTTP_TIMEOUT_MS` for the HTTP client.
   - *(Optional)* `REQUIRE_DISTRIBUTED_CACHE=true` if you want production deployments to fail when Redis is unavailable.

2. **Database**

   ```bash
   docker compose up -d
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm prisma:seed
   ```

3. **Install deps & run**

   ```bash
 pnpm install
  pnpm dev
  ```

   Visit `http://localhost:3000` and log in with the seeded admin.

### Perintah Prisma (Ringkasan)

Gunakan rangkaian perintah berikut untuk mengelola Prisma secara cepat ketika mengembangkan fitur baru:

```bash
pnpm prisma:format    # Rapikan schema.prisma
pnpm prisma:generate  # Regenerasi Prisma Client
pnpm prisma:migrate   # Terapkan migrasi dev
pnpm prisma:seed      # Seed ulang data demo/admin
pnpm prisma:studio    # Buka Prisma Studio untuk inspeksi data
```

### Menjalankan Aplikasi Secara Lokal

Setelah dependensi terpasang dan database siap, jalankan:

```bash
pnpm dev              # Mode pengembangan dengan HMR
```

Untuk build dan menjalankan hasil build produksi:

```bash
pnpm build            # Build Next.js
pnpm start            # Menjalankan server hasil build
```

### Database Portability

- **Supported providers:** PostgreSQL, MySQL, SQL Server, and Oracle (Oracle requires Prisma’s preview driver; expect slower migrations and fewer native functions).
- **Switching providers:** open `prisma/schema.prisma`, locate the `datasource db` block, and change `provider = "postgresql"` to the target provider (`"mysql"`, `"sqlserver"`, or `"oracle"`). Update `DATABASE_PROVIDER` + `DATABASE_URL` in `.env`, then run:

  ```bash
  pnpm prisma:format
  pnpm prisma:migrate reset --skip-seed
  pnpm prisma:migrate
  pnpm prisma:generate
  ```

  Each environment should stick to a single provider. Never apply migrations generated for a different provider to production.
- **Connection strings:** `.env.example` includes templates for every provider. SQL Server connection strings must include `encrypt=true`. Oracle uses the `oracle://USER:PASSWORD@HOST:PORT/SERVICE` format that Prisma expects.
- **Modeling constraints:** Prisma models only use portable scalar types (`String`, `Int`, `BigInt`, `Boolean`, `DateTime`, `Decimal`). IDs rely on Prisma-managed `cuid()` values, so no database-specific sequences or UUID extensions are required. Enums (e.g., `Role`) represent domain concepts only.
- **Provider-aware behavior:** `src/db/provider.ts` reads `DATABASE_PROVIDER` and exposes feature flags. Queries such as `getUsers` only enable case-insensitive filters when a provider guarantees support.
- **Database boundary:** all Prisma usage lives in `src/features/**/(queries|server)` folders. ESLint forbids importing `@/db` or `@prisma/client` from UI/shared code, ensuring a clear separation.
- **Migrations:** keep a dedicated migration history per provider (e.g., `prisma/migrations` for PostgreSQL, `prisma/migrations.mysql` when targeting MySQL). Reset or fork migrations before switching providers to avoid mixing SQL dialects.
- **Known limitations:** Provider-specific features such as full-text search, JSON operators, partial indexes, or non-portable data types are intentionally omitted so the starter remains portable. SQL Server and Oracle treat substring filters as case-sensitive because Prisma’s `mode: "insensitive"` is unavailable there; implement provider-specific fallbacks if you need that behavior.

### Optional Redis & Axios Support

This starter runs perfectly without Redis or Axios. Small projects can use the in-memory cache and the built-in `fetch` HTTP client and never touch these features.

- **Redis (optional):**
  - Set `REDIS_URL` to enable the Redis cache backend automatically; otherwise, an in-memory cache is used.
  - Recommended for: rate limiting across multiple instances, caching expensive queries, and any production deployment with more than one server.
  - Production note: multi-instance deployments must configure Redis so rate limits remain consistent everywhere. You can set `REQUIRE_DISTRIBUTED_CACHE=true` to make production builds exit early instead of silently falling back to the in-memory adapter.
- **HTTP client module (optional):**
  - `src/shared/http` exposes a small abstraction with a default `fetch` client and an Axios-powered client.
  - Axios is ideal for large integrations that need interceptors, retries, upload/download progress, or token refresh workflows.
  - Features can swap clients by importing from `@/shared/http` without depending on Axios directly.
- **Environment variables:**
  - `REDIS_URL` - optional Redis connection string.
  - `REQUIRE_DISTRIBUTED_CACHE` - set to `true` when Redis must be present (recommended for multi-instance deployments).
  - `HTTP_BASE_URL` - optional base URL used by HTTP clients.
  - `HTTP_TIMEOUT_MS` - optional per-request timeout (defaults to 10s).
  - HTTP_TIMEOUT_MS - optional per-request timeout (defaults to 10s).

### Scripts

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `pnpm dev`           | Start Next.js dev server                |
| `pnpm build`         | Production build                        |
| `pnpm start`         | Run built app                           |
| `pnpm lint`          | ESLint (strict, Next.js aware)          |
| `pnpm format`        | Prettier                                |
| `pnpm audit`         | Dependency vulnerability scan (high+)   |
| `pnpm test`          | Vitest unit + integration tests         |
| `pnpm prisma:format` | Prisma schema formatter                 |
| `pnpm prisma:generate` | Generate Prisma Client                |
| `pnpm prisma:migrate` | Run dev migrations                     |
| `pnpm prisma:studio` | Prisma Studio UI                        |
| `pnpm prisma:seed`   | Seed database entries                   |

Husky + lint-staged run lint/format on staged files before commit.

### Testing

`pnpm test` runs the Vitest suite (fast, deterministic, Node environment). Additional helpers:

- `pnpm test:watch` – watch mode during development.
- `pnpm test:coverage` – coverage report using V8 instrumentation.

Current tests focus on shared helpers (crypto, pagination, query/query merging, error handling) and representative feature queries (`getUsers` with mocked Prisma).

### Pre-commit workflow

- Husky installs automatically via `pnpm install` (see the `prepare` script). The pre-commit hook runs `lint-staged`, which formats staged files with Prettier and fixes/lints TS/JS files with ESLint.
- To temporarily disable the hook project-wide, either set `PRE_COMMIT_ENABLED=false` in your environment or update `config/tooling.ts` (env takes precedence). When disabled, the hook prints “Pre-commit checks are disabled via configuration.” and exits successfully.
- To bypass once, run `git commit --no-verify`.
- Recommended CI gate: run `pnpm lint && pnpm typecheck && pnpm test` so the server-enforced checks remain the source of truth.

### Notes

- Theme tokens live in `src/shared/config/theme.ts`. Updating those variables rebrands the entire UI (light/dark), and you can switch the preset palette via the `THEME_VARIANT` env (`default`, `red`, `purple`, `blue`).
- `src/shared/lib/crypto.ts` exposes AES-256-GCM encrypt/decrypt using the validated `ENCRYPTION_KEY`.
- Role-based access control: only admins hit user management actions, while `/api/me` lets regular users fetch their own profile.
- Middleware enforces redirects: unauthenticated users go to `/login`, authenticated users hitting `/login` are redirected to `/dashboard`.
