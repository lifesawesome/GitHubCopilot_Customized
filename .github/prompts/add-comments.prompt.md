---
name: 'add-comments'
description: 'Add descriptive comments to TypeScript/React code following project conventions'
agent: 'agent'
---

# Add Comments to Code

Analyze the selected code and add meaningful comments following these rules:

## TypeScript Files (.ts)
- Add **JSDoc comments** above functions, interfaces, and exported members
- Use `/** */` format for documentation comments
- Include `@param`, `@returns`, and `@throws` tags where applicable
- Add inline `//` comments only for non-obvious logic

```typescript
/**
 * Retrieves all branches associated with a headquarters.
 * @param hqId - The headquarters identifier
 * @returns Array of Branch objects, empty if none found
 */
```

## React Components (.tsx)
- Add JSDoc above the component definition explaining its purpose
- Document complex props interfaces
- Comment non-obvious hooks or state patterns

```tsx
/**
 * Displays a grid of products with search and cart functionality.
 * Supports dark/light themes via ThemeContext.
 */
const Products: React.FC = () => { ... };
```

## Swagger Route Comments
- Ensure every API endpoint has complete `@swagger` JSDoc blocks
- Include request/response schemas, tags, and status codes

## Rules
- Do NOT add obvious comments (e.g., `// increment counter` on `count++`)
- Keep comments concise — one sentence preferred
- Update stale comments if the code has changed
- Match the tone and style of existing comments in the file
