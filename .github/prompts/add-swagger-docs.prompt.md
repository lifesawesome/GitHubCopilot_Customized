---
name: 'add-swagger-docs'
description: 'Generate complete Swagger/OpenAPI JSDoc comments for Express API endpoints'
agent: 'agent'
---

# Add Swagger Documentation

Analyze the selected Express route file and add comprehensive Swagger JSDoc annotations.

## Requirements

### For Each Endpoint Generate:
1. `@swagger` block with full path (e.g., `/api/products`)
2. HTTP method (`get`, `post`, `put`, `delete`)
3. `summary` — one-line description
4. `tags` — entity name in plural (e.g., `[Products]`)
5. `parameters` — for path params (`:id`)
6. `requestBody` — for POST/PUT with schema
7. `responses` — all possible status codes with descriptions

### Template for GET All:
```typescript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
```

### Template for POST:
```typescript
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request body
 */
```

### Template for GET by ID / PUT / DELETE:
Include `parameters` array with path parameter:
```yaml
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: integer
    description: The entity ID
```

## Rules
- Match the entity model properties from `api/src/models/`
- Use `$ref` to reference shared schemas where possible
- Define `components/schemas` entries if they don't exist
- Ensure Swagger UI renders correctly at `/api-docs`
