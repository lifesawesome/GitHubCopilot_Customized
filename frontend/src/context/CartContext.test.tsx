import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CartProvider, useCart, type CartProduct } from './CartContext';

const sampleProduct: CartProduct = {
  productId: 1,
  name: 'Test Product',
  description: 'A sample product for cart testing',
  price: 10,
  imgName: 'test-product.png',
  sku: 'SKU-001',
  unit: 'each',
  supplierId: 99,
};

describe('CartContext', () => {
  it('throws when used outside a CartProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      expect(() => renderHook(() => useCart())).toThrow(
        'useCart must be used within a CartProvider'
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('adds a product, opens the cart and computes totals', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    act(() => {
      result.current.addToCart(sampleProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({
      quantity: 2,
      product: sampleProduct,
    });
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBeCloseTo(20);
    expect(result.current.isOpen).toBe(true);
  });

  it('updates quantities and clears the cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });

    act(() => {
      result.current.addToCart(sampleProduct, 1);
    });

    act(() => {
      result.current.updateQuantity(sampleProduct.productId, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);

    act(() => {
      result.current.updateQuantity(sampleProduct.productId, 0);
    });

    expect(result.current.items).toHaveLength(0);

    act(() => {
      result.current.addToCart(sampleProduct, 1);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });
});
