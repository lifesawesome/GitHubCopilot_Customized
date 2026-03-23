---
name: 'generate-api-route'
description: 'Scaffold a new Express API route with CRUD operations, Swagger docs, and tests'
mode: 'agent'
---

# Generate New API Route

Create a complete Express API route file with full CRUD operations, Swagger documentation, and a corresponding test file.

## Required Input
Specify the entity name and its model properties. If no model exists yet, create one first.

## Files to Generate

### 1. Model (`api/src/models/{entity}.ts`)
```typescript
export interface Entity {
    id: number;
    // ... properties from the ERD or user input
}
```

### 2. Route (`api/src/routes/{entity}.ts`)
- Import model and seed data
- Define Express Router
- Implement all 5 CRUD endpoints:
  - `GET /` — List all
  - `GET /:id` — Get by ID (404 if missing)
  - `POST /` — Create (201, validate required fields)
  - `PUT /:id` — Update (404 if missing, validate fields)
  - `DELETE /:id` — Delete (204, 404 if missing)
- Add complete Swagger JSDoc for every endpoint
- Export router as default

### 3. Test File (`api/src/routes/{entity}.test.ts`)
Follow `branch.test.ts` pattern:
- Import vitest, supertest, express
- `beforeEach` to reset app state
- Test all CRUD operations
- Test error scenarios (404, 400)
- At least 7 test cases

### 4. Registration
Add route to `api/src/index.ts`:
```typescript
import entityRoutes from './routes/{entity}';
app.use('/api/{entities}', entityRoutes);
```

### 5. Seed Data (Optional)
Add sample data to `api/src/seedData.ts` if the entity needs initial records.

## Naming Conventions
- Route path: plural kebab-case (`/api/order-details`)
- File names: camelCase (`orderDetail.ts`)
- Interface: PascalCase (`OrderDetail`)
- Swagger tags: PascalCase plural (`[OrderDetails]`)

## Run Verification
After generation, run:
```bash
npm run build --workspace=api
npm test --workspace=api
```
