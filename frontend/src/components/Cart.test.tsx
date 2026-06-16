import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Cart } from './Cart';
import { CartProvider, useCart, type CartProduct } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';

const sampleProduct: CartProduct = {
  productId: 7,
  name: 'Cart Test Product',
  description: 'A product used in cart UI tests',
  price: 15,
  imgName: 'cart-test.png',
  sku: 'CART-007',
  unit: 'each',
  supplierId: 3,
};

function CartHarness() {
  const { addToCart } = useCart();

  useEffect(() => {
    addToCart(sampleProduct, 2);
  }, []);

  return <Cart />;
}

function renderCart() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <CartProvider>
          <CartHarness />
        </CartProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Cart', () => {
  it('shows the empty state when there are no items', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <CartProvider>
            <Cart />
          </CartProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('dialog', { name: /shopping cart/i })).toBeInTheDocument();
    expect(screen.getByText(/no items in your manifest/i)).toBeInTheDocument();
  });

  it('renders cart items, updates quantities, and removes items', async () => {
    const user = userEvent.setup();
    renderCart();

    expect(screen.getByText('Cart Test Product')).toBeInTheDocument();
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    expect(screen.getAllByText('$30.00').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /increase quantity of cart test product/i }));
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$45.00').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /decrease quantity of cart test product/i }));
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$30.00').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /remove cart test product from cart/i }));
    expect(screen.getByText(/no items in your manifest/i)).toBeInTheDocument();
  });
});
