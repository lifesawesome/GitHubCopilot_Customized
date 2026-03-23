---
applyTo: '**/*.tsx'
---

# React Component Instructions

## Component Pattern
- Always use functional components with hooks
- Define TypeScript interfaces for all props
- Use `React.FC<Props>` for component typing
- Keep components focused on a single responsibility

```tsx
interface ProductCardProps {
    product: Product;
    onAddToCart: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <div className="rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">${product.price}</p>
            <button
                onClick={() => onAddToCart(product.id)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Add to Cart
            </button>
        </div>
    );
};
```

## Styling
- Use **Tailwind CSS** utility classes exclusively — no inline styles
- Support dark mode via `dark:` prefix classes
- Use ThemeContext for theme state management
- Common patterns:
  - `bg-white dark:bg-gray-800` for backgrounds
  - `text-gray-900 dark:text-white` for text
  - `rounded-lg shadow-md` for cards

## State Management
- Use `useState` for local component state
- Use `useContext` for shared state (AuthContext, ThemeContext)
- Use `react-query` for server state and API calls
- Lift state only when needed by siblings

## Hooks
- Custom hooks go in a `hooks/` directory (if created)
- Prefix custom hooks with `use` (e.g., `useProducts`)
- Keep hook logic separate from rendering

## API Integration
- Use the API config from `src/api/config.ts` for endpoint URLs
- Use Axios via react-query for data fetching
- Handle loading, error, and empty states in every component

```tsx
const { data: products, isLoading, error } = useQuery('products', fetchProducts);

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error loading products</div>;
```

## Routing
- Use React Router v6+ patterns
- Define routes in `App.tsx`
- Use `<Link>` for navigation — never `<a href>` for internal routes

## Component Organization

| Directory | Purpose | Example |
|-----------|---------|---------|
| `components/` | Shared UI components | Navigation, Footer, Login |
| `components/entity/` | Entity-specific views | Products grid, ProductForm |
| `components/admin/` | Admin-only components | AdminProducts table |
| `context/` | React context providers | AuthContext, ThemeContext |
| `api/` | API client configuration | config.ts |

## Code Review Checklist
- [ ] Props interface defined with TypeScript
- [ ] Tailwind classes used (no inline styles)
- [ ] Dark mode support via `dark:` classes
- [ ] Loading/error states handled
- [ ] Accessible (`aria-label`, semantic HTML)
- [ ] No direct API URLs — use config.ts
