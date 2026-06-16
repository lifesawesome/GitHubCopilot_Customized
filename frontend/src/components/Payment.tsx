import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

/* ── types ─────────────────────────────────────────────────── */

interface PaymentForm {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  billingAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

type FormErrors = Partial<Record<keyof PaymentForm, string>>;

/* ── helpers ────────────────────────────────────────────────── */

/** Format raw digits as "1234 5678 9012 3456" */
function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

/** Format raw digits as "MM/YY" */
function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

/** Detect card network from first digit(s) */
function detectCardNetwork(number: string): 'visa' | 'mastercard' | 'amex' | 'unknown' {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return 'unknown';
}

/* ── validation ─────────────────────────────────────────────── */

function validate(form: PaymentForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required.';
  const digits = form.cardNumber.replace(/\s/g, '');
  if (digits.length < 15) errors.cardNumber = 'Enter a valid card number.';
  const [mm, yy] = form.expiry.split('/');
  const month = parseInt(mm, 10);
  const year = parseInt(`20${yy}`, 10);
  const now = new Date();
  if (!mm || !yy || month < 1 || month > 12 || year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
    errors.expiry = 'Enter a valid expiry date.';
  }
  if (form.cvv.length < 3) errors.cvv = 'Enter a valid CVV.';
  if (!form.billingAddress.trim()) errors.billingAddress = 'Billing address is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.postalCode.trim()) errors.postalCode = 'Postal code is required.';
  if (!form.country.trim()) errors.country = 'Country is required.';
  return errors;
}

/* ── sub-components ─────────────────────────────────────────── */

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
      {label}
    </label>
    {children}
    {error && (
      <p role="alert" className="text-xs text-red-500 dark:text-red-400 mt-0.5">
        {error}
      </p>
    )}
  </div>
);

const inputBase =
  'w-full px-3 py-2.5 rounded-lg border text-sm font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50';

function inputCls(darkMode: boolean, hasError: boolean): string {
  const border = hasError
    ? 'border-red-400 dark:border-red-500'
    : darkMode
    ? 'border-gray-600 focus:border-primary'
    : 'border-gray-300 focus:border-primary';
  const bg = darkMode ? 'bg-gray-800 text-gray-100 placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400';
  return `${inputBase} ${bg} ${border}`;
}

/* ── network badge ──────────────────────────────────────────── */

const NetworkBadge: React.FC<{ network: ReturnType<typeof detectCardNetwork> }> = ({ network }) => {
  if (network === 'unknown') return null;
  const labels: Record<string, string> = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX' };
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold tracking-widest text-primary opacity-80 select-none pointer-events-none">
      {labels[network]}
    </span>
  );
};

/* ── confirmation overlay ───────────────────────────────────── */

const ConfirmationOverlay: React.FC<{ totalPrice: number; onDone: () => void }> = ({ totalPrice, onDone }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center space-y-5 animate-fade-in">
      {/* Animated check */}
      <div className="flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Placed!</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Your payment of{' '}
        <span className="font-mono font-bold text-primary">${totalPrice.toFixed(2)}</span> was processed
        successfully. Your cat supplies are on their way! 🐱
      </p>
      <button
        onClick={onDone}
        className="w-full py-3 rounded-lg bg-primary hover:bg-accent text-white font-semibold transition-colors"
      >
        Back to Shop
      </button>
    </div>
  </div>
);

/* ── main component ─────────────────────────────────────────── */

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { darkMode } = useTheme();

  const [form, setForm] = useState<PaymentForm>({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  /* redirect if cart is empty */
  if (!confirmed && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Your cart is empty.</p>
        <button onClick={() => navigate('/products')} className="text-primary font-semibold hover:underline underline-offset-2">
          Browse Products →
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'cardNumber') formatted = formatCardNumber(value);
    if (name === 'expiry') formatted = formatExpiry(value);
    if (name === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 4);
    setForm(prev => ({ ...prev, [name]: formatted }));
    if (errors[name as keyof PaymentForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setProcessing(true);
    /* Simulate async payment processing */
    await new Promise(res => setTimeout(res, 1800));
    setProcessing(false);
    setConfirmed(true);
    clearCart();
  };

  const handleDone = () => {
    navigate('/products');
  };

  const network = detectCardNetwork(form.cardNumber);
  const subtotalAfterDiscount = totalPrice;

  return (
    <>
      {confirmed && <ConfirmationOverlay totalPrice={subtotalAfterDiscount} onDone={handleDone} />}

      <div className={`min-h-screen py-10 px-4 transition-colors ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cart
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Secure Checkout</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your payment information is encrypted and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── Payment form ─────────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className={`lg:col-span-3 rounded-2xl p-6 space-y-6 shadow-md border
                ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
            >
              {/* Card details section */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Card Details
                </h2>
                <div className="space-y-4">
                  <Field label="Cardholder Name" error={errors.cardholderName}>
                    <input
                      type="text"
                      name="cardholderName"
                      value={form.cardholderName}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      autoComplete="cc-name"
                      aria-label="Cardholder name"
                      className={inputCls(darkMode, !!errors.cardholderName)}
                    />
                  </Field>

                  <Field label="Card Number" error={errors.cardNumber}>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        autoComplete="cc-number"
                        aria-label="Card number"
                        className={inputCls(darkMode, !!errors.cardNumber)}
                      />
                      <NetworkBadge network={network} />
                    </div>
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry" error={errors.expiry}>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="expiry"
                        value={form.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        autoComplete="cc-exp"
                        aria-label="Card expiry date"
                        className={inputCls(darkMode, !!errors.expiry)}
                      />
                    </Field>
                    <Field label="CVV" error={errors.cvv}>
                      <input
                        type="password"
                        inputMode="numeric"
                        name="cvv"
                        value={form.cvv}
                        onChange={handleChange}
                        placeholder="•••"
                        autoComplete="cc-csc"
                        aria-label="CVV security code"
                        className={inputCls(darkMode, !!errors.cvv)}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Billing address section */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Billing Address
                </h2>
                <div className="space-y-4">
                  <Field label="Street Address" error={errors.billingAddress}>
                    <input
                      type="text"
                      name="billingAddress"
                      value={form.billingAddress}
                      onChange={handleChange}
                      placeholder="123 Purrfect Lane"
                      autoComplete="street-address"
                      aria-label="Billing street address"
                      className={inputCls(darkMode, !!errors.billingAddress)}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="City" error={errors.city}>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Meow City"
                        autoComplete="address-level2"
                        aria-label="City"
                        className={inputCls(darkMode, !!errors.city)}
                      />
                    </Field>
                    <Field label="Postal Code" error={errors.postalCode}>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        placeholder="00000"
                        autoComplete="postal-code"
                        aria-label="Postal code"
                        className={inputCls(darkMode, !!errors.postalCode)}
                      />
                    </Field>
                  </div>

                  <Field label="Country" error={errors.country}>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      aria-label="Country"
                      className={inputCls(darkMode, !!errors.country)}
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="IN">India</option>
                      <option value="BR">Brazil</option>
                      <option value="MX">Mexico</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-accent text-white font-bold text-sm tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pay ${subtotalAfterDiscount.toFixed(2)}
                  </>
                )}
              </button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 pt-1">
                {['256-bit SSL', 'PCI DSS', 'Encrypted'].map(label => (
                  <span key={label} className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                    {label}
                  </span>
                ))}
              </div>
            </form>

            {/* ── Order summary ─────────────────────────────── */}
            <aside className="lg:col-span-2 space-y-4">
              <div className={`rounded-2xl p-5 shadow-md border
                ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
              >
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Order Summary
                </h2>

                <ul className="space-y-3">
                  {items.map(({ product, quantity }) => {
                    const effectivePrice = product.discount
                      ? product.price * (1 - product.discount)
                      : product.price;
                    return (
                      <li key={product.productId} className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border
                          ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
                        >
                          <img
                            src={`/${product.imgName}`}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold font-mono text-primary flex-shrink-0">
                          ${(effectivePrice * quantity).toFixed(2)}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <div className={`mt-4 pt-4 border-t space-y-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotalAfterDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="font-mono text-primary font-semibold">Free</span>
                  </div>
                  <div className={`flex justify-between font-bold text-base pt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span>Total</span>
                    <span className="font-mono text-primary">${subtotalAfterDiscount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping note */}
              <div className={`rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 border flex gap-3
                ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}
              >
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <span>
                  Free express shipping on all OctoCAT supply orders. Estimated delivery: 2–5 business days.
                </span>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
