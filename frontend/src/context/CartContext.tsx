/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartProduct {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (product: CartProduct, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
