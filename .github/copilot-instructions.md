# Copilot Custom Instructions for OctoCAT Supply Chain

## Overview
This workspace is a modern TypeScript monorepo containing a supply chain management demo application with an Express.js REST API and a React frontend. It showcases GitHub Copilot features including Agent Mode, Vision, MCP servers, custom instructions, and test generation.

## File-Specific Instructions
See the `.github/instructions/` folder for detailed guidelines by file type:

| File Pattern | Instruction File | Description |
|--------------|------------------|-------------|
| `**/*.ts` | [typescript.instructions.md](instructions/typescript.instructions.md) | TypeScript source files |
| `**/*.tsx` | [react.instructions.md](instructions/react.instructions.md) | React components |
| `api/**/*.ts` | [api-routes.instructions.md](instructions/api-routes.instructions.md) | Express API routes |
| `**/*.test.ts` | [testing.instructions.md](instructions/testing.instructions.md) | Vitest test files |
| `**/*.json` | [project.instructions.md](instructions/project.instructions.md) | Package & config files |

## Project Context
- **App Name**: OctoCAT Supply Chain Management System
- **Domain**: Cat-themed supply chain with HQ → Branches → Orders → Products → Deliveries
- **Architecture**: Monorepo with `api/` (Express + TypeScript) and `frontend/` (React + Vite + Tailwind)
- **API Documentation**: Swagger/OpenAPI at `/api-docs`
- **Observability**: TAO (TypeScript API Observability) internal framework — see [docs/tao.md](../docs/tao.md)

---

## TypeScript Coding Best Practices

### 1. Strict Mode
All TypeScript files must compile with strict mode enabled:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Interfaces | PascalCase with I prefix optional | `Branch`, `IOrder` |
| Types | PascalCase | `OrderStatus` |
| Classes | PascalCase | `DeliveryService` |
| Functions/Methods | camelCase | `getBranches()` |
| Variables | camelCase | `branchCount` |
| Constants | UPPER_SNAKE_CASE or camelCase | `MAX_RETRY_COUNT`, `apiBaseUrl` |
| Route paths | kebab-case | `/api/order-details` |
| File names | camelCase | `orderDetail.ts` |
| Test files | camelCase with .test suffix | `branch.test.ts` |

### 3. API Routes
- All routes must use Express Router
- Add Swagger JSDoc comments for every endpoint
- Use proper HTTP status codes (200, 201, 204, 400, 404, 500)
- Validate request body before processing
- Follow REST naming conventions (plural nouns for collections)

```typescript
/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: Get all branches
 *     tags: [Branches]
 *     responses:
 *       200:
 *         description: List of branches
 */
router.get('/', (req: Request, res: Response) => {
    res.json(branches);
});
```

### 4. Error Handling
- Use try/catch in async route handlers
- Return consistent error response shapes
- Never expose stack traces in production

```typescript
try {
    const result = await service.getData(id);
    if (!result) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.json(result);
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
}
```

### 5. React Components
- Use functional components with hooks
- Use TypeScript interfaces for props
- Keep components focused (single responsibility)
- Use Tailwind CSS for styling — avoid inline styles
- Implement dark/light theme via ThemeContext

```tsx
interface ProductCardProps {
    product: Product;
    onAddToCart: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    // component implementation
};
```

### 6. Testing
- Use Vitest with Supertest for API route testing
- Follow the pattern in `branch.test.ts`
- Test CRUD operations + error scenarios
- Use `describe/it/expect` blocks with clear descriptions

### 7. Observability (TAO Framework)
When adding observability, follow the [TAO documentation](../docs/tao.md):
- Assume TAO is installed — never add the package
- Use `@Measure`, `@Trace`, `@Log` decorators
- Configure via environment variables

---

## Project Structure

```
├── api/              # Express.js REST API
│   ├── src/
│   │   ├── models/   # Entity interfaces
│   │   ├── routes/   # Express route handlers
│   │   ├── index.ts  # Server entry point
│   │   └── seedData.ts
│   └── vitest.config.ts
├── frontend/         # React + Vite + Tailwind
│   └── src/
│       ├── api/      # API client configuration
│       ├── components/
│       ├── context/  # Auth, Theme providers
│       └── App.tsx   # Routes & providers
├── docs/             # Architecture, deployment, demos
└── infra/            # Azure deployment scripts
```

---

## Code Review Checklist
- [ ] TypeScript strict mode compiles without errors
- [ ] Swagger docs added for new API endpoints
- [ ] Error handling with proper status codes
- [ ] No hardcoded URLs or secrets
- [ ] React components use TypeScript props interfaces
- [ ] Tailwind classes used (no inline styles)
- [ ] Tests added for new routes/components
- [ ] CORS configuration reviewed for new endpoints
