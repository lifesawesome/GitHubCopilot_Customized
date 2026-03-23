---
applyTo: '**/*.test.ts'
---

# Testing Instructions (Vitest + Supertest)

## Framework
- **Test Runner**: Vitest
- **HTTP Testing**: Supertest
- **Pattern**: Follow `branch.test.ts` as the reference implementation

## Test File Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRoutes from './product';

describe('Product API', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/products', productRoutes);
    });

    // CRUD tests
    it('should create a new product', async () => { /* POST */ });
    it('should get all products', async () => { /* GET all */ });
    it('should get a product by ID', async () => { /* GET by ID */ });
    it('should update a product by ID', async () => { /* PUT */ });
    it('should delete a product by ID', async () => { /* DELETE */ });

    // Error scenarios
    it('should return 404 for non-existing product', async () => { /* 404 */ });
    it('should return 400 for invalid payload', async () => { /* 400 */ });
});
```

## Test Coverage Requirements

### For Each Route:
- **CRUD Operations**: GET all, GET by ID, POST, PUT, DELETE
- **Error Scenarios**: 404 for missing entities, 400 for invalid payloads
- **Edge Cases**: Empty collections, malformed IDs, missing fields

## Assertions
- Use `expect(res.status).toBe(200)` for status codes
- Use `expect(res.body).toHaveProperty('id')` for response shape
- Use `expect(res.body).toHaveLength(n)` for collections

## Running Tests

```bash
# Run all tests
npm test --workspace=api

# Run with coverage
npm test --workspace=api -- --coverage

# Run specific test file
npm test --workspace=api -- src/routes/product.test.ts
```

## Test Naming
- Use descriptive `it('should ...')` statements
- Group related tests in `describe` blocks
- Name test files matching source: `product.ts` → `product.test.ts`

## Current Coverage Status

| Route File | Test File | Status |
|------------|-----------|--------|
| branch.ts | branch.test.ts | ✅ Complete |
| product.ts | product.test.ts | ❌ Missing |
| supplier.ts | supplier.test.ts | ❌ Missing |
| order.ts | order.test.ts | ❌ Missing |
| delivery.ts | delivery.test.ts | ❌ Missing |
| headquarters.ts | headquarters.test.ts | ❌ Missing |
| orderDetail.ts | orderDetail.test.ts | ❌ Missing |
| orderDetailDelivery.ts | orderDetailDelivery.test.ts | ❌ Missing |

## Code Review Checklist
- [ ] All CRUD operations tested
- [ ] Error scenarios covered (404, 400)
- [ ] `beforeEach` resets app state
- [ ] Descriptive test names
- [ ] No hardcoded port numbers
- [ ] Tests are independent (no order dependency)
