# PrepForge

PrepForge is a PNPM/Turbo monorepo with:

- `apps/api`: Fastify + Drizzle + PostgreSQL backend
- `apps/web`: Next.js frontend
- `packages/shared`: shared Zod schemas and types

## Tech Stack

- Node.js (recommended: 22+)
- PNPM workspaces
- Turborepo
- Next.js 15
- Fastify 5
- Drizzle ORM
- PostgreSQL 16 (Docker Compose)

## Monorepo Structure

```text
apps/
  api/        # Fastify API
  web/        # Next.js app
packages/
  shared/     # shared schemas/types
```

## Prerequisites

- Node.js 22+
- pnpm 12+
- Docker (for local PostgreSQL)

If you use Corepack:

```bash
corepack enable
corepack prepare pnpm@12.5.1 --activate
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Create `apps/api/.env`:

```env
DATABASE_URL=postgres://prepforge:prepforge@localhost:5432/prepforge
JWT_SECRET=replace-with-a-long-random-secret
CORS_ORIGIN=http://localhost:3000
```

4. Run database migrations:

```bash
pnpm --filter @prepforge/api db:migrate
```

5. Start all apps in development mode:

```bash
pnpm dev
```

Local URLs:

- Web: http://localhost:3000
- API: http://localhost:3001
- Health check: http://localhost:3001/health

## Scripts

From repo root:

```bash
pnpm dev          # turbo dev across workspaces
pnpm build        # turbo build
pnpm lint         # turbo lint
pnpm typecheck    # turbo typecheck
```

Targeted workspace commands:

```bash
pnpm --filter @prepforge/api dev
pnpm --filter @prepforge/web dev
pnpm --filter @prepforge/shared typecheck
```

## Database Commands (API)

```bash
pnpm --filter @prepforge/api db:generate
pnpm --filter @prepforge/api db:migrate
```

## API Routes (v1)

Base URL: `http://localhost:3001/api/v1`

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (JWT required)

Topics:

- `GET /topics`
- `POST /topics` (JWT required)
- `GET /topics/:id`
- `PATCH /topics/:id` (JWT required)
- `DELETE /topics/:id`

Questions:

- `GET /questions`
- `POST /questions` (JWT required)
- `GET /questions/:id`
- `PATCH /questions/:id` (JWT required)
- `DELETE /questions/:id` (JWT required)
- `POST /questions/:id/publish` (JWT required)
- `POST /questions/:id/unpublish` (JWT required)

Progress:

- `GET /users/me/progress` (optional JWT)
- `PATCH /questions/:id/progress` (JWT required)

## Notes

- API startup will fail if `JWT_SECRET` is missing.
- API database access requires `DATABASE_URL`.
- `CORS_ORIGIN` defaults to `http://localhost:3000` if unset.
