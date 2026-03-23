---
applyTo: '**/*.ts'
---

# TypeScript Instructions

## Strict Mode
Every TypeScript file must compile with `strict: true`. Never use `any` unless absolutely necessary — prefer `unknown` and narrow with type guards.

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Interfaces | PascalCase | `Branch`, `Product` |
| Types | PascalCase | `OrderStatus`, `DeliveryStatus` |
| Enums | PascalCase members | `OrderStatus.Pending` |
| Functions | camelCase | `getBranches()`, `calculateTotal()` |
| Variables | camelCase | `branchCount`, `orderTotal` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_PORT` |
| File names | camelCase | `orderDetail.ts`, `seedData.ts` |

## Imports
- Use named imports over default imports where possible
- Group imports: Node builtins → third-party → local modules
- Use path aliases from `tsconfig.json` if configured

```typescript
// Node builtins
import { readFileSync } from 'fs';

// Third-party
import express, { Request, Response } from 'express';
import cors from 'cors';

// Local
import { Branch } from '../models/branch';
import { seedBranches } from '../seedData';
```

## Error Handling
- Use `try/catch` blocks for async operations
- Return typed error responses — never throw unhandled
- Log errors with context (method name, entity ID, operation)

```typescript
try {
    const result = await fetchData(id);
    if (!result) {
        return res.status(404).json({ error: `Entity ${id} not found` });
    }
    res.json(result);
} catch (error) {
    console.error(`Error in getData(${id}):`, error);
    res.status(500).json({ error: 'Internal server error' });
}
```

## Type Definitions
- Define interfaces in `models/` directory, one per file
- Use `readonly` for properties that should not change after creation
- Export all interfaces/types for cross-module use

```typescript
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    readonly createdAt: Date;
}
```

## Collections & Data
- Use `Map<K, V>` or typed arrays (`Product[]`) — avoid untyped collections
- Prefer `Array.find()`, `Array.filter()`, `Array.map()` over manual loops
- Use `const` by default; `let` only when reassignment is needed

## Async Patterns
- Use `async/await` over raw Promises or callbacks
- Always handle the rejection path
- Use `Promise.all()` for independent parallel operations

## Code Review Checklist
- [ ] No `any` types (use `unknown` + type guards)
- [ ] All functions have explicit return types
- [ ] Error handling with proper status codes
- [ ] No hardcoded strings for configuration
- [ ] Console logs use structured error logging
