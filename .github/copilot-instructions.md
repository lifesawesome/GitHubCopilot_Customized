# Copilot Custom Instructions for OctoCAT Supply Chain

## Overview

OctoCAT Supply Chain is a TypeScript monorepo with an **Express.js REST API** (`api/`) and a **React + Vite + Tailwind frontend** (`frontend/`). The domain is a cat-themed supply chain: HQ → Branches → Orders → Products → Deliveries.

## Quick Reference

| | API | Frontend |
|---|---|---|
| **Port** | 3000 (`PORT` env) | 5137 |
| **Build** | `npm run build --workspace=api` | `npm run build --workspace=frontend` |
| **Dev** | `npm run dev:api` | `npm run dev:frontend` |
| **Test** | `npm run test:api` | `npm run test:frontend` |
| **Both** | `npm run dev` | `npm run test` |

### Key Commands

```bash
# Install (from repo root — uses npm workspaces)
npm ci

# Build everything
npm run build

# Run all tests
npm run test

# Run a single API test file
npx vitest run api/src/routes/branch.test.ts

# Lint frontend
npm run lint --workspace=frontend
```

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `PORT` | API server port | `3000` |
| `API_CORS_ORIGINS` | Comma-separated allowed origins | localhost + Codespace URLs |
| `CODESPACE_NAME` | Auto-set in GitHub Codespaces | — |

---

## Architecture

```
├── api/                 # Express.js REST API (CommonJS, ES6 target)
│   ├── src/
│   │   ├── models/      # TypeScript interfaces + Swagger schema JSDoc
│   │   ├── routes/      # Express Router handlers (one file per entity)
│   │   ├── index.ts     # Server setup: CORS, Swagger, route mounting
│   │   └── seedData.ts  # In-memory seed data for all entities
│   ├── vitest.config.ts # Vitest + node environment
│   └── Dockerfile       # Multi-stage: build (tsc) → runtime (node:20-alpine)
├── frontend/            # React 18 + Vite 6 + Tailwind 3
│   └── src/
│       ├── api/config.ts    # Axios base URL (Codespace-aware)
│       ├── components/      # Pages + entity CRUD components
│       ├── context/         # AuthContext, ThemeContext (dark/light)
│       └── App.tsx          # Routes: /, /about, /products, /login, /admin/*
├── docs/                # Architecture, deployment, demo scripts
└── infra/               # Azure deployment scripts
```

### Data Model Relationships

```
Headquarters (1) → (*) Branch → (*) Order → (*) OrderDetail → (*) OrderDetailDelivery
                                              ↕                    ↕
                                           Product              Delivery
                                              ↕
                                           Supplier
```

### API Entities & Routes

All routes are mounted at `/api/<plural-entity>` (e.g., `/api/branches`, `/api/products`).
Each route file provides standard CRUD: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`.
Swagger UI is served at `/api-docs`.

---

## File-Specific Instructions

Detailed conventions are in `.github/instructions/` and auto-apply by file pattern:

| File Pattern | Instruction File | Key Points |
|---|---|---|
| `**/*.ts` | [typescript.instructions.md](instructions/typescript.instructions.md) | Strict mode, no `any`, naming conventions |
| `**/*.tsx` | [react.instructions.md](instructions/react.instructions.md) | Functional components, Tailwind only, dark mode via `dark:` |
| `api/src/routes/**/*.ts` | [api-routes.instructions.md](instructions/api-routes.instructions.md) | Swagger JSDoc required, Express Router, seed data pattern |
| `**/*.test.ts` | [testing.instructions.md](instructions/testing.instructions.md) | Vitest + Supertest, follow `branch.test.ts` pattern |
| `**/*.json` | [project.instructions.md](instructions/project.instructions.md) | npm workspaces, always use `--workspace=` flag |

---

## Critical Conventions

### API Routes
- **Every endpoint MUST have a `@swagger` JSDoc block** — the API-Reviewer agent flags missing docs as Critical
- Use Express Router with in-memory data from `seedData.ts`
- HTTP status codes: 200 (OK), 201 (Created), 204 (Delete), 400 (Bad request), 404 (Not found)
- Error shape: `{ error: string }`
- Export a `reset<Entity>()` function for test isolation
- ID generation: `Math.max(...items.map(i => i.id)) + 1`

### Frontend
- **Tailwind CSS only** — no inline styles, no CSS modules
- Dark mode: use `dark:` Tailwind prefix + `ThemeContext` (`darkMode` boolean)
- Auth: `AuthContext` — `isAdmin` = email ends with `@github.com` (demo only)
- API calls: Axios via `frontend/src/api/config.ts` — never hardcode URLs
- State: `useState` (local), `useContext` (auth/theme), `react-query` (server data)
- Brand colors: primary `#76B852`, accent `#8BC34A`, dark `#0A0A0A`

### Testing
- **Only `branch.test.ts` exists** — all other route test files are missing
- Pattern: fresh Express app in `beforeEach`, call `reset*()` to restore seed data
- Test both success paths (CRUD) and error paths (404, 400 validation)

### Observability (TAO Framework)
- Assume TAO is installed — **never add the package**
- Use `@Measure`, `@Trace`, `@Log` decorators — see [docs/tao.md](../docs/tao.md)

---

## Code Review Checklist
- [ ] TypeScript strict mode compiles without errors
- [ ] Swagger JSDoc added for new API endpoints
- [ ] Error handling with proper HTTP status codes
- [ ] No hardcoded URLs or secrets
- [ ] React components use TypeScript props interfaces
- [ ] Tailwind classes used (no inline styles)
- [ ] Tests added for new routes/components
- [ ] `reset*()` export added for testability
