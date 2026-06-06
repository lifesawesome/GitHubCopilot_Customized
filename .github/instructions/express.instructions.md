---
applyTo: 'api/**/*.ts'
---

# Express API Instructions

## Route File Structure

Every route file follows this pattern:

```typescript
import { Router, Request, Response } from 'express';
const router = Router();

// In-memory data store (imported from seedData)
let entities: Entity[] = [...seedEntities];

// CRUD operations with Swagger docs
// GET all → GET by ID → POST → PUT → DELETE

export default router;
```

Routes are mounted in `index.ts`:

```typescript
app.use('/api/products', productRoutes);
app.use('/api/branches', branchRoutes);
```

## Swagger Documentation

Every endpoint MUST have Swagger JSDoc comments:

```typescript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', (req: Request, res: Response) => {
    res.json(products);
});
```

## HTTP Status Codes

| Operation | Success | Not Found | Bad Request |
|-----------|---------|-----------|-------------|
| GET all | 200 | — | — |
| GET by ID | 200 | 404 | — |
| POST | 201 | — | 400 |
| PUT | 200 | 404 | 400 |
| DELETE | 204 | 404 | — |

## Error Responses

Return consistent error shapes:

```typescript
res.status(404).json({ error: 'Product not found' });
res.status(400).json({ error: 'Name is required' });
```

## ID Generation

```typescript
const newId = entities.length > 0
    ? Math.max(...entities.map(e => e.id)) + 1
    : 1;
```

## CORS

Configured at the app level in `index.ts`. Do not add CORS headers in individual routes.

---

## Model / Interface Files

Every model file exports one `interface` and one `@swagger` JSDoc schema block:

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Widget:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */
export interface Widget {
    id: number;
    name: string;
}
```

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Interface | Singular PascalCase | `Branch`, `OrderDetail` |
| Primary key | `<entity>Id` (camelCase) | `branchId`, `supplierId` |
| File | Singular camelCase | `orderDetail.ts` |

### Rules

- Mark optional properties with `?` in TypeScript and omit from `required` in Swagger.
- Document FK relationships in property descriptions.
- No business logic in model files — only interfaces and Swagger JSDoc.

---

## Observability (TAO)

When adding observability, use the TAO framework decorators:
- `@Measure` for performance metrics
- `@Trace` for distributed tracing
- `@Log` for structured logging
- Assume TAO is installed — never add the package

---

## Code Review Checklist

- [ ] Swagger JSDoc on every endpoint
- [ ] Proper HTTP status codes
- [ ] Input validation on POST/PUT
- [ ] 404 handling for GET/PUT/DELETE by ID
- [ ] Consistent error response format
- [ ] Route mounted in index.ts
- [ ] Model interface + schema defined
- [ ] No unnecessary dependencies added
- [ ] TypeScript strict mode compiles without errors
