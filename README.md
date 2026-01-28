## Starter Next.js Dashboard

A production-grade Next.js starter focused on clean architecture, credentials-based authentication, Prisma/PostgreSQL, and a polished DX powered by shadcn/ui, Tailwind CSS, and full TypeScript coverage.

### Highlights

- **Next.js App Router + Server Actions** with strict TypeScript and domain-focused features.
- **Auth.js (NextAuth) credentials flow** using bcrypt hashing, middleware-protected routes, and seeded admin access.
- **Prisma + PostgreSQL** (Docker Compose) including migrations, seeding, and provider-aware helpers for other SQL engines.
- **Feature-first structure** that isolates UI, domain logic, and infrastructure (`src/features`, `src/shared`, `src/db`, `src/app`).
- **Design system ready**: Tailwind + shadcn/ui components, global light/dark theming defined in `src/shared/config/theme.ts`.
- **Users management demo**: server-side pagination/search/sort, zod validation, toasts, and role-based CRUD.
- **DX tooling**: ESLint, Prettier, Vitest, Husky + lint-staged, reusable server-action utilities, AES-256-GCM crypto helpers, pagination/query builders, and optional Redis/Axios adapters that stay idle unless configured.

### Architecture Overview

```
src/
  app/         Route groups, api handlers, middleware
  features/
    auth/      Auth config, login action, helpers
    users/     Schemas, queries, server actions, UI
  shared/
    config/    env + theme tokens
    layouts/   Dashboard shell (sidebar/topbar)
    lib/       Utilities (crypto/pagination/query/error/date/logger)
    providers/ Theme provider
    ui/        shadcn primitives + design tokens
  db/          Prisma client + provider helpers
```

### Requirements

- Node.js 18+ with `pnpm`.
- Docker Desktop or compatible runtime (for PostgreSQL).
- `openssl` (or similar) for generating secure secrets.

### Getting Started

1. **Environment variables**

   ```bash
   cp .env.example .env
   ```

   Populate the following:

   - `DATABASE_URL` - matches the Docker defaults unless you customize ports.
   - `NEXTAUTH_SECRET` - run `openssl rand -base64 32`.
   - `NEXTAUTH_URL` - e.g., `http://localhost:3000`.
   - `ENCRYPTION_KEY` - base64 32 bytes (`openssl rand -base64 32`).
   - `DATABASE_PROVIDER` + provider-specific `DATABASE_URL` if you are not on PostgreSQL.
   - Optional: `REDIS_URL`, `HTTP_BASE_URL`, `HTTP_TIMEOUT_MS`, `REQUIRE_DISTRIBUTED_CACHE`.

2. **Database & Prisma**

   ```bash
   docker compose up -d
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm prisma:seed
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

### Running & Deployment

- **Development**: `pnpm dev` starts the Next.js dev server with HMR at `http://localhost:3000`. Log in using the seeded admin `admin@example.com / Admin123!`.
- **Production**: `pnpm build` compiles the app and `pnpm start` runs the optimized server. Ensure `DATABASE_URL`, `NEXTAUTH_URL`, and secrets are set in the production environment.

### Prisma Workflow

Use these commands to keep your schema and client in sync:

```bash
pnpm prisma:format    # Format prisma/schema.prisma
pnpm prisma:generate  # Regenerate Prisma Client
pnpm prisma:migrate   # Apply dev migrations
pnpm prisma:seed      # Seed demo/admin data
pnpm prisma:studio    # Inspect data via Prisma Studio
```

### Tooling Commands

| Command       | Description                                      |
| ------------- | ------------------------------------------------ |
| `pnpm lint`   | Run ESLint with project rules                    |
| `pnpm format` | Run Prettier on supported files                  |
| `pnpm audit`  | Scan dependencies for high-severity vulnerabilities |

### Database Portability

- **Supported providers**: PostgreSQL, MySQL, SQL Server, Oracle (Oracle uses Prisma's preview driver; expect slower migrations).
- **Switching providers**:

  ```bash
  # Update prisma/schema.prisma datasource provider
  pnpm prisma:format
  pnpm prisma:migrate reset --skip-seed
  pnpm prisma:migrate
  pnpm prisma:generate
  ```

  Keep a dedicated migration history per provider (e.g., `prisma/migrations.mysql`). Never mix migration outputs across providers or apply PostgreSQL SQL to another engine.
- **Connection strings**: `.env.example` includes templates. SQL Server strings must include `encrypt=true`. Oracle uses `oracle://USER:PASSWORD@HOST:PORT/SERVICE`.
- **Modeling constraints**: Prisma models rely on portable scalar types and Prisma-managed `cuid()` IDs, so no provider-specific extensions are required. Provider-aware logic (e.g., case-insensitive filters) is centralized in `src/db/provider.ts`.

### Optional Redis & Axios Support

- Leave `REDIS_URL` undefined to use the in-memory cache; set it to enable Redis-backed caching and rate limiting. In multi-instance deployments, set `REQUIRE_DISTRIBUTED_CACHE=true` so builds fail fast if Redis is unavailable.
- `src/shared/http` exposes a lightweight abstraction that defaults to `fetch` but can swap to an Axios-based client without updating feature code. Configure `HTTP_BASE_URL` and `HTTP_TIMEOUT_MS` as needed.

### Testing

- `pnpm test` runs the Vitest suite (Node environment) covering shared helpers and representative feature queries.
- `pnpm test:watch` enables watch mode during development.
- `pnpm test:coverage` generates V8 coverage reports.

### Pre-commit Workflow

- Husky installs automatically through the `prepare` script (`pnpm install` will set it up).
- The pre-commit hook runs `lint-staged`, formatting files via Prettier and fixing/linting TS/JS via ESLint.
- Temporarily disable hooks by setting `PRE_COMMIT_ENABLED=false` (env var) or editing `config/tooling.ts`. Use `git commit --no-verify` for a one-off bypass.
- Recommended CI gate: `pnpm lint && pnpm typecheck && pnpm test`.

### Additional Notes

- Theme tokens live in `src/shared/config/theme.ts`. Updating them rebrands the UI, and `THEME_VARIANT` (`default`, `red`, `purple`, `blue`) switches palettes.
- `src/shared/lib/crypto.ts` provides AES-256-GCM helpers validated against `ENCRYPTION_KEY`.
- Access control limits user-management actions to admins; `/api/me` lets regular users fetch their profile.
- Middleware enforces redirects: unauthenticated users go to `/login`, and authenticated users hitting `/login` are redirected to `/dashboard`.
