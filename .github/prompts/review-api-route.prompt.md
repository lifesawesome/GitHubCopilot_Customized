---
name: 'review-api-route'
description: 'Review an Express API route file for correctness, security, Swagger docs, and best practices'
agent: 'ask'
---

# Review API Route

Review the selected Express route file against OctoCAT project standards.

## Review Checklist

### 1. CRUD Completeness
| Operation | Endpoint | Present? |
|-----------|----------|----------|
| GET all | `GET /` | |
| GET by ID | `GET /:id` | |
| Create | `POST /` | |
| Update | `PUT /:id` | |
| Delete | `DELETE /:id` | |

### 2. Swagger Documentation
- [ ] Every endpoint has `@swagger` JSDoc block
- [ ] Tags match the entity name (plural)
- [ ] Request body schemas defined for POST/PUT
- [ ] Response schemas reference model definitions
- [ ] All status codes documented (200, 201, 204, 400, 404)

### 3. Error Handling
- [ ] 404 returned when entity not found (GET/PUT/DELETE by ID)
- [ ] 400 returned for invalid/missing request body fields
- [ ] Consistent error response shape: `{ error: string }`
- [ ] No unhandled exceptions

### 4. Security
- [ ] No hardcoded credentials or secrets
- [ ] Input validation on all user-provided data
- [ ] ID parameters parsed safely (parseInt with NaN check)
- [ ] No SQL injection risk (in-memory data is safe, but pattern matters)

### 5. Code Quality
- [ ] Uses Express Router pattern
- [ ] TypeScript types used for Request/Response
- [ ] Follows naming conventions from instructions
- [ ] Clean separation — no business logic in route handlers

### 6. Testing
- [ ] Corresponding `.test.ts` file exists
- [ ] Tests cover all CRUD operations
- [ ] Tests cover error scenarios (404, 400)

## Output
Provide findings organized by severity:
- **Critical**: Must fix before merge
- **Warning**: Should fix, not blocking
- **Info**: Nice to have improvements
