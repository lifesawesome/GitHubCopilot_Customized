# Cart Module

The cart module provides shopping-cart functionality for the OctoCAT Supply Chain frontend. It lets users add products to an **Order Manifest** (the cart), adjust quantities, remove items, and review a running total before placing an order.

---

## Files

| File | Purpose |
|------|---------|
| `frontend/src/context/CartContext.tsx` | React context — state management and cart operations |
| `frontend/src/components/Cart.tsx` | Slide-in drawer UI that renders the cart contents |
| `frontend/src/components/Navigation.tsx` | Consumes `useCart` to show the cart badge and open button |
| `frontend/src/components/entity/product/Products.tsx` | Calls `addToCart` when a user adds a product |
| `frontend/src/App.tsx` | Wraps the app in `<CartProvider>` and renders `<Cart />` globally |

---

## Architecture

```
App
 └── CartProvider          (CartContext.tsx — global state)
      └── ThemedApp
           ├── Navigation  (cart icon + badge)
           ├── Cart         (drawer UI)
           └── Products     (add-to-cart actions)
```

`CartProvider` holds all cart state in memory via React `useState`. There is currently no persistence — the cart resets on a full page reload.

---

## Data Types

### `CartProduct`

Represents a product that has been (or can be) added to the cart.

```ts
interface CartProduct {
  productId: number;    // unique identifier
  name: string;
  description: string;
  price: number;        // base price in USD
  imgName: string;      // image filename (served from the public root)
  sku: string;          // stock-keeping unit code
  unit: string;         // unit of measurement (e.g. "kg", "pcs")
  supplierId: number;
  discount?: number;    // optional fractional discount, e.g. 0.1 = 10 % off
}
```

### `CartItem`

A single line in the cart, pairing a product with a quantity.

```ts
interface CartItem {
  product: CartProduct;
  quantity: number;     // always ≥ 1; setting to 0 removes the item
}
```

---

## `CartContext` API

Provided by `CartProvider` and consumed via the `useCart()` hook.

### State

| Property | Type | Description |
|----------|------|-------------|
| `items` | `CartItem[]` | All items currently in the cart |
| `isOpen` | `boolean` | Whether the cart drawer is visible |
| `totalItems` | `number` | Sum of all item quantities |
| `totalPrice` | `number` | Sum of effective line prices (discounts applied) |

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `addToCart` | `(product: CartProduct, quantity: number) => void` | Adds `quantity` units of `product`. If the product is already in the cart its quantity is incremented. Quantities ≤ 0 are ignored. Also opens the cart drawer. |
| `removeFromCart` | `(productId: number) => void` | Removes the item with the given `productId` entirely. |
| `updateQuantity` | `(productId: number, quantity: number) => void` | Sets the quantity of an item. Passing `quantity ≤ 0` removes the item (delegates to `removeFromCart`). |
| `clearCart` | `() => void` | Empties the cart. |
| `openCart` | `() => void` | Opens the cart drawer. |
| `closeCart` | `() => void` | Closes the cart drawer. |

### Price Calculation

`totalPrice` is computed as:

```
totalPrice = Σ ( effectivePrice(item) × item.quantity )

effectivePrice(item) =
  item.product.discount
    ? item.product.price × (1 − item.product.discount)
    : item.product.price
```

---

## Using the Hook

Wrap the component tree with `<CartProvider>` (already done in `App.tsx`), then call `useCart()` in any descendant component:

```tsx
import { useCart } from '../context/CartContext';

function MyComponent() {
  const { items, totalItems, addToCart, removeFromCart } = useCart();
  // ...
}
```

`useCart()` throws an error if called outside a `CartProvider`:

```
Error: useCart must be used within a CartProvider
```

---

## `Cart` Component

`frontend/src/components/Cart.tsx` renders a **right-side slide-in drawer** with:

- **Backdrop** — a semi-transparent overlay that closes the cart when clicked.
- **Header** — cart icon, "Order Manifest" title, item count badge, and a close button.
- **Item list** — scrollable list of `CartItem`s, each showing:
  - Product thumbnail
  - Product name and SKU
  - Quantity controls (− / +)
  - Remove button
  - Line total (with strikethrough original price when a discount applies)
- **Empty state** — illustrated prompt to browse products when the cart is empty.
- **Footer** (only when items are present):
  - Subtotal with item count
  - **Place Order** button (shows a placeholder alert — checkout is not yet implemented)
  - **Clear Manifest** button

The drawer supports both light and dark mode via `ThemeContext`.

### Accessibility

| Feature | Implementation |
|---------|---------------|
| Drawer role | `role="dialog"` with `aria-modal="true"` and `aria-label="Shopping cart"` |
| Backdrop | `aria-hidden="true"` |
| Quantity buttons | `aria-label` describes the action and the product name |
| Remove button | `aria-label` includes the product name |
| Cart nav button | `aria-label` includes the current item count |

---

## Integration Points

### Navigation Bar

`Navigation.tsx` renders a cart icon button that:
- Calls `openCart()` when clicked.
- Displays a green badge with `totalItems` when the cart is non-empty.

```tsx
const { totalItems, openCart } = useCart();

<button onClick={openCart} aria-label={`Open cart, ${totalItems} items`}>
  {/* cart SVG icon */}
  {totalItems > 0 && <span>{totalItems}</span>}
</button>
```

### Products Page

`Products.tsx` calls `addToCart(product, quantity)` after the user selects a quantity and clicks **Add to Cart**:

```tsx
const { addToCart } = useCart();

function handleAddToCart(productId: number) {
  const quantity = quantities[productId] || 0;
  const product = products?.find(p => p.productId === productId);
  if (quantity > 0 && product) {
    addToCart(product, quantity);
  }
}
```

---

## Known Limitations

- **No persistence** — cart state lives in React memory only and is lost on full page reload.
- **No checkout** — the "Place Order" button displays a placeholder alert; checkout flow is not yet implemented.
- **Frontend-only** — the cart does not interact with the backend API; no order is created in the database.
