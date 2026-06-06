import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export const Cart: React.FC = () => {
  const { items, isOpen, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart, closeCart } = useCart();
  const { darkMode } = useTheme();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} bg-black/60 backdrop-blur-sm`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
          shadow-2xl border-l ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center gap-3">
            {/* Cart icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-bold text-base tracking-wide uppercase">
              Order Manifest
            </span>
            {totalItems > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                No items in your manifest
              </p>
              <button
                onClick={closeCart}
                className="text-primary text-sm font-semibold hover:underline underline-offset-2"
              >
                Browse Products →
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map(({ product, quantity }) => {
                const effectivePrice = product.discount
                  ? product.price * (1 - product.discount)
                  : product.price;
                const lineTotal = effectivePrice * quantity;

                return (
                  <li key={product.productId} className={`flex gap-4 p-4 ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} transition-colors`}>
                    {/* Thumbnail */}
                    <div className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                      <img
                        src={`/${product.imgName}`}
                        alt={product.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{product.name}</p>
                      <p className={`text-xs mt-0.5 font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{product.sku}</p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(product.productId, quantity - 1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className={`w-6 h-6 flex items-center justify-center rounded border font-bold text-sm transition-colors
                            ${darkMode ? 'border-gray-600 text-gray-300 hover:border-primary hover:text-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'}`}
                        >
                          −
                        </button>
                        <span className="font-mono text-sm w-6 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.productId, quantity + 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                          className={`w-6 h-6 flex items-center justify-center rounded border font-bold text-sm transition-colors
                            ${darkMode ? 'border-gray-600 text-gray-300 hover:border-primary hover:text-primary' : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'}`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price + remove */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <button
                        onClick={() => removeFromCart(product.productId)}
                        aria-label={`Remove ${product.name} from cart`}
                        className={`text-xs transition-colors ${darkMode ? 'text-gray-600 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className="text-right">
                        {product.discount && (
                          <p className={`text-xs line-through font-mono ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                            ${(product.price * quantity).toFixed(2)}
                          </p>
                        )}
                        <p className="text-primary font-bold font-mono text-sm">
                          ${lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={`border-t px-6 py-5 space-y-4 ${darkMode ? 'border-gray-700 bg-gray-950' : 'border-gray-200 bg-gray-50'}`}>
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </span>
              <span className="text-xl font-bold font-mono text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <button
              className="w-full bg-primary hover:bg-accent text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm tracking-wide"
              onClick={() => alert('Checkout coming soon!')}
            >
              Place Order
            </button>
            <button
              onClick={clearCart}
              className={`w-full text-sm font-medium py-2 rounded-lg border transition-colors
                ${darkMode ? 'border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-400' : 'border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500'}`}
            >
              Clear Manifest
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Cart;
