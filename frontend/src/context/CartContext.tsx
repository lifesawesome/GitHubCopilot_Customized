/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';

/** Represents a product that can be added to the cart, mirroring the API Product shape. */
export interface CartProduct {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  /** Optional fractional discount, e.g. 0.25 = 25% off. */
  discount?: number;
}

/** A single line in the cart: a product paired with its selected quantity. */
export interface CartItem {
  product: CartProduct;
  quantity: number;
}

/**
 * Shape of the value provided by CartContext.
 * Consumed via the `useCart` hook.
 */
interface CartContextType {
  /** All line items currently in the cart. */
  items: CartItem[];
  /** Whether the cart drawer is currently visible. */
  isOpen: boolean;
  /** Sum of all item quantities. */
  totalItems: number;
  /** Total cost after applying any per-product discounts. */
  totalPrice: number;
  /** Adds a product to the cart; increments quantity if already present. */
  addToCart: (product: CartProduct, quantity: number) => void;
  /** Removes a line item from the cart entirely. */
  removeFromCart: (productId: number) => void;
  /** Sets an item's quantity; removes the item if quantity is zero or below. */
  updateQuantity: (productId: number, quantity: number) => void;
  /** Empties all items from the cart. */
  clearCart: () => void;
  /** Opens the cart drawer. */
  openCart: () => void;
  /** Closes the cart drawer. */
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

/**
 * Provides cart state and actions to the component tree.
 * Wrap the application root (or a subtree) with this provider.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Applies fractional discounts before summing to produce the correct subtotal.
  const totalPrice = items.reduce((sum, item) => {
    const effectivePrice = item.product.discount
      ? item.product.price * (1 - item.product.discount)
      : item.product.price;
    return sum + effectivePrice * item.quantity;
  }, 0);

  const addToCart = (product: CartProduct, quantity: number) => {
    if (quantity <= 0) return;
    setItems(prev => {
      const existing = prev.find(i => i.product.productId === product.productId);
      if (existing) {
        return prev.map(i =>
          i.product.productId === product.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.product.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook that exposes the cart state and all cart actions.
 * @throws {Error} When used outside of a `CartProvider`.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
