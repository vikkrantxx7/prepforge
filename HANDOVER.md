# PrepForge Development Handover

**Date:** 2026-10-12  
**Current Phase:** Week 3 (GraphQL + Frontend Landing Page in progress)  
**Developer:** Vikrant Sharma

## Project Overview

PrepForge is an open-source full-stack interview preparation platform for software engineers. It's being built as both a learning project (Vikrant is actively job searching and using this to learn) and a production app targeting PWA + mobile-first.

**Key Context:**
- This is a learning-by-doing project — explain concepts, guide rather than write code
- Vikrant is a senior fullstack engineer (13yr exp, frontend-heavy) actively job searching
- PostgreSQL is genuinely new to him

---

## Tech Stack

### Backend (`apps/api`)
- **Framework:** Fastify 5.3
- **Database:** PostgreSQL in Docker
- **ORM:** Drizzle ORM
- **Auth:** JWT via `@fastify/jwt`
- **GraphQL:** Mercurius (graphql@16 for compatibility)
- **Validation:** Zod (shared in `packages/shared`)

### Frontend (`apps/web`)
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui (base-vega preset)
- **State:** React Context (will migrate to server-side auth later)
- **Target:** PWA, mobile-first, offline-capable

### Monorepo
- **Tool:** Turborepo
- **Package Manager:** pnpm
- **Linter/Formatter:** Biome (configured at root)

---

## Current Architecture

### Backend Structure
```
apps/api/src/
├── db/
│   ├── schema.ts          # Drizzle schema (topics, questions, users, user_progress)
│   └── migrate.ts         # Migration runner
├── modules/
│   ├── auth/              # /register, /login, /me
│   ├── topics/            # Topics CRUD (uses slug, not id)
│   ├── questions/         # Questions CRUD
│   └── progress/          # Progress upsert + retrieval
├── graphql/
│   ├── schema.graphql     # Schema-first SDL
│   ├── resolvers.ts       # Query/Mutation resolvers
│   └── dataloaders.ts     # DataLoader for N+1 prevention
├── plugins/
│   ├── jwt.ts             # JWT auth + optionalAuth decorators
│   └── graphql.ts         # Mercurius plugin + errorFormatter
└── types/
    └── fastify.d.ts       # Module augmentation for JWT types
```

### Frontend Structure (FSD-inspired naming)
```
apps/web/src/
├── app/                   # Next.js routing
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Landing page (empty, to be built)
├── widgets/
│   └── navbar/            # Compound component (Logo, Links, Actions, Profile)
├── entities/              # (empty, will hold Question, Topic, User entities)
├── shared/
│   ├── ui/                # shadcn components (button, sheet)
│   ├── lib/
│   │   ├── authContext.tsx    # Auth context + User type
│   │   ├── AuthProvider.tsx   # Auth provider with mock state
│   │   └── hooks/useAuth.tsx  # useAuth hook
│   └── config/            # (empty, will hold constants)
└── types/
    └── css.d.ts           # CSS module declarations
```

---

## Key Decisions & Patterns

### Data Model
- **Category = Technology** (JavaScript, React, Node.js, Docker)
- **Topic = Concept** (Event Loop, Promises, Hooks)
- **Tags = Cross-cutting keywords** (async, performance, security)
- **Progress Status:** `"studying" | "completed"` (absence = unseen)

### Auth Model
- Guests have full read access (topics, questions, answers)
- Login unlocks progress tracking
- JWT stored client-side (will migrate to httpOnly cookies later)
- `authenticate` preHandler for write endpoints
- `optionalAuth` for GET progress (returns `[]` for guests)

### GraphQL
- Schema-first (SDL in `schema.graphql`)
- Auth via context function (calls `request.jwtVerify()` inline)
- DataLoader batches `user_progress` queries keyed by `questionId`
- ErrorFormatter maps `23503` FK violations → 404, Unauthorized → 401

### Frontend Patterns
- Compound components: `<Navbar><Navbar.Logo /></Navbar>`
- File naming: PascalCase for components, camelCase for utils
- Tailwind v4: theme defined in `globals.css` via `@theme` block
- Colors: oklch values for light/dark modes

---

## What's Complete

### Backend (Week 1-3)
✅ Fastify REST API (topics, questions, auth, progress)  
✅ PostgreSQL + Drizzle migrations  
✅ JWT auth (`/register`, `/login`, `/me`)  
✅ GraphQL layer with Mercurius  
✅ DataLoader for N+1 on user progress  
✅ Foreign keys: `user_progress.userId` → `users.id`, `user_progress.questionId` → `questions.id` (CASCADE delete)

### Frontend (Week 3 - In Progress)
✅ Next.js 15 scaffolded  
✅ shadcn/ui installed (button, sheet)  
✅ Tailwind v4 configured with PrepForge palette (deep space navy dark, blue-white light)  
✅ Auth context with mock state  
✅ Navbar with compound components (Logo, Links, Actions, Profile)  
✅ Sheet for profile menu (auth-aware: logged in shows Profile/Logout, guest shows Login/Signup buttons)

---

## What's Next (Immediate Tasks)

### 1. Hero Section (`widgets/heroSection/HeroSection.tsx`)
**Mockup reference:** `/apps/web/assets/` (hero images moved to `public/hero-dark.png`, `public/hero-light.png`)

Structure:
- Background: space image (dark mode uses `hero-dark.png`, light mode uses `hero-light.png`)
- Headline: "Sharpen Your Skills. Build a **Stronger You.**" (Stronger You in accent blue)
- Tagline: "Curated questions, real-world scenarios..."
- Two CTAs: "Start Practicing" (primary), "Explore Topics" (outline)
- Mobile: add search bar in hero, stats strip (1500+ questions, 15+ topics, 10K+ devs)

### 2. Categories Section (`widgets/categoriesSection/`)
Grid of category cards (JavaScript, React, Node.js, System Design) with:
- Icon + name + description
- Topic count + question count
- Click → navigates to `/topics?category=JavaScript`

### 3. Recently Added Section
Horizontal scrollable question cards with:
- Difficulty badge (Medium, Hard)
- Category icon
- Question text preview
- Time estimate + "Added X days ago"

### 4. Mobile Navigation
Add hamburger menu for mobile (Sheet with nav links) — currently links are `hidden md:flex`

---

## Important Conventions

### File Naming
- Components: PascalCase (`Navbar.tsx`, `HeroSection.tsx`)
- Utils/hooks: camelCase (`authContext.tsx`, `useAuth.ts`)
- Next.js reserved: lowercase (`layout.tsx`, `page.tsx`)
- shadcn UI: lowercase (`button.tsx`, `sheet.tsx`)

### Import Aliases
- `@/` → `src/` (configured in `tsconfig.json`)
- `@/shared/ui` → `src/shared/ui`
- `@/shared/lib` → `src/shared/lib`

### Git Commit Messages
End with: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

---

## Known Issues / TODO

### Backend
- `ADMIN_SECRET` endpoint still exists (should be removed, real auth is in place)
- No refresh token pattern yet (single JWT, long expiry)
- GraphQL subscriptions not implemented (not needed yet)

### Frontend
- Auth is mock context (no real JWT wiring to backend yet)
- No theme switcher UI (dark/light mode defined but no toggle)
- No mobile hamburger menu yet
- No error boundaries
- No loading states

### Database
- No `intervalDays` on `user_progress` for spaced repetition (discussed, not implemented)
- No subtopics (decided to keep flat: category → topic → tags)

---

## Environment Setup

### Start Backend
```bash
# Start Postgres
docker compose up -d

# Run migrations
pnpm --filter @prepforge/api db:migrate

# Start API
pnpm --filter @prepforge/api dev
```
API runs at `http://localhost:3001`  
GraphiQL at `http://localhost:3001/graphiql`

### Start Frontend
```bash
pnpm --filter @prepforge/web dev
```
Web runs at `http://localhost:3000`

### Seed Data
Use the REST API to create topics and questions. Example:
```bash
# Register + login to get token
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'

# Use token to create topics
curl -X POST http://localhost:3001/api/v1/topics \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Event Loop", "slug": "event-loop", "category": "JavaScript", "description": "..."}'
```

---

## Config Files

### Biome (`biome.json`)
- Linter enabled with React domain rules
- Formatter: 2-space indent, single quotes, trailing commas
- CSS parser: `tailwindDirectives: true` (fixes false positives on `@theme`, `@apply`)
- Overrides: excludes Next.js reserved files + `shared/ui/` from `useComponentExportOnlyModules`

### Tailwind (`apps/web/src/app/globals.css`)
Colors use oklch format. Main tokens:
- Light: `--background: oklch(0.97 0.02 250)` (#F0F6FF approx)
- Dark: `--background: oklch(0.07 0.03 255)` (#070F1A approx)
- Accent: `--accent: oklch(0.62 0.13 250)` (#4A90D9 approx)

### shadcn (`apps/web/components.json`)
- Style: `base-vega`
- Aliases: `@/shared/ui`, `@/shared/lib`
- Icon library: `lucide`

---

## Resources

### Design Mockups
- Desktop light/dark: see images uploaded in session (astronaut hero, category cards)
- Mobile: single column, bottom nav (Home, Topics, Practice, Profile)

### API Docs
GraphQL schema: `apps/api/src/graphql/schema.graphql`  
REST routes documented inline in route files

### Learning Goals (Vikrant's Interview Prep Topics)
- Week 1: Fastify + REST ✅
- Week 2: PostgreSQL + Drizzle + JWT ✅
- Week 3: GraphQL + DataLoader + TanStack Query (in progress)
- Week 4: CI/CD + Docker + Observability + PWA (not started)

---

## Notes for Next Developer

1. **Vikrant is learning** — explain decisions, don't just write code. He wants to understand why.
2. **Mobile-first** — every component should work on mobile before desktop polish.
3. **No premature abstractions** — keep it simple until complexity is earned.
4. **Biome is strict** — follow the conventions it enforces (naming, import order, etc).
5. **Memory file** at `.claude/projects/-Users-sharmvia-repos-prepforge/memory/` tracks project decisions across sessions.

---

## Contact

**Developer:** Vikrant Sharma  
**Project Goal:** Learn full-stack + build portfolio piece + job search prep  
**Timeline:** 4 weeks build plan (currently end of Week 3)

Good luck! 🚀
