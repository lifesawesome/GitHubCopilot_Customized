---
applyTo: 'api/src/models/**/*.ts'
---

# Model / Interface Instructions

## Required Structure

Every model file must export exactly one `interface` and one `@swagger` JSDoc schema block:

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
 *           description: Unique identifier
 *         name:
 *           type: string
 *           description: Human-readable name
 */
export interface Widget {
    id: number;
    name: string;
}
```

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Interface | Singular PascalCase | `Branch`, `OrderDetail` |
| Primary key | `<entity>Id` (camelCase) | `branchId`, `supplierId` |
| File | Singular camelCase | `orderDetail.ts`, `supplier.ts` |
| Schema tag | Matches interface name | `$ref: '#/components/schemas/Branch'` |

## Required Fields

Every model must declare which properties are `required` in the Swagger schema. Optional properties should use `?` in the TypeScript interface AND be excluded from the `required:` list.

```typescript
export interface Order {
    orderId: number;      // required
    branchId: number;     // required
    status: string;       // required
    notes?: string;       // optional — omit from swagger required[]
}
```

## No Business Logic

Model files contain **only** TypeScript interfaces and Swagger JSDoc. No functions, no classes, no constants. Keep all computation in route handlers or service layers.

## Relationships

Document foreign-key relationships in property descriptions:

```typescript
/**
 *         branchId:
 *           type: integer
 *           description: ID of the Branch this order belongs to (FK → Branch.branchId)
 */
```
