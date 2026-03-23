---
applyTo: '**/package.json,**/tsconfig.json,**/*.json'
---

# Project & Config File Instructions

## Monorepo Structure
This project uses npm workspaces with two sub-projects:

```
├── package.json          # Root — workspaces: ["api", "frontend"]
├── api/package.json      # Express.js API
└── frontend/package.json # React + Vite frontend
```

## Root package.json Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Build all workspaces |
| `npm run dev` | Start all dev servers |
| `npm test` | Run all tests |
| `npm run lint` | Lint all workspaces |

## Workspace Commands
Always specify the workspace when running commands:

```bash
npm run build --workspace=api
npm run dev --workspace=frontend
npm test --workspace=api
```

## TypeScript Configuration
- `api/tsconfig.json` targets Node.js (CommonJS output)
- `frontend/tsconfig.json` targets browser (ESNext modules)
- Both use `strict: true`

## Key Dependencies

### API
| Package | Purpose |
|---------|---------|
| express | HTTP server framework |
| cors | CORS middleware |
| swagger-jsdoc | Swagger doc generation |
| swagger-ui-express | Swagger UI hosting |
| vitest | Test runner |
| supertest | HTTP assertion library |

### Frontend
| Package | Purpose |
|---------|---------|
| react, react-dom | UI framework |
| react-router-dom | Client-side routing |
| axios | HTTP client |
| react-query | Server state management |
| tailwindcss | Utility-first CSS |
| vite | Build tool & dev server |

## Version Management
- Use exact versions in `dependencies` for production stability
- Use caret ranges (`^`) in `devDependencies`
- Run `npm audit` regularly

## Code Review Checklist
- [ ] No unnecessary dependencies added
- [ ] Workspace scripts use correct workspace flag
- [ ] TypeScript strict mode enabled
- [ ] No conflicting dependency versions between workspaces
