import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CheckoutModal from "../components/CheckoutModal";
import OrderSuccessModal from "../components/OrderSuccessModal";
import { useCart } from "../hooks/useCart";

export default function CartPage() {
  const {
    cart,
    isLoading,
    totalAmount,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const productsInCart = cart?.products || [];
  const isEmpty = productsInCart.length === 0;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center animate-pulse space-y-4">
        <div className="h-6 w-32 bg-black/10 mx-auto rounded-sm" />
        <div className="h-24 max-w-md bg-black/5 mx-auto rounded-sm" />
      </div>
    );
  }

  if (isEmpty && !confirmedOrder) {
    return (
      <section className="mx-auto max-w-4xl py-16 text-center sm:py-24">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-lime text-ink shadow-sm">
          <ShoppingBag size={22} />
        </span>
        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
          Your bag
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl text-ink">
          Room for something good.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-xs sm:text-sm leading-6 text-ink/60">
          Your bag is looking a little light. Check out the latest season drop to find your next rotation favorite.
        </p>
        <Link to="/products" className="action-link mt-8">
          Start exploring <ArrowRight size={15} />
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-black/[0.08] pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
            <Sparkles size={14} className="text-lime" /> Review Your Selection
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink">
            Shopping Bag ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>
        </div>

        <Link
          to="/products"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink/60 hover:text-ink transition"
        >
          <ArrowLeft size={13} /> Continue Shopping
        </Link>
      </div>

      {/* Main Grid: Items (Left) & Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
              Bag Items
            </span>
            <button
              type="button"
              disabled={isClearing}
              onClick={() => clearCart()}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition disabled:opacity-40"
            >
              <Trash2 size={12} /> Clear Bag
            </button>
          </div>

          <div className="space-y-3">
            {productsInCart.map((item) => (
              <CartItem
                key={`${item.product?._id || item.product}-${item.size}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                isUpdating={isUpdating || isRemoving}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-black/10 bg-white p-6 space-y-5 shadow-sm">
            <h2 className="font-display text-xl font-black uppercase text-ink border-b border-black/10 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-ink/75">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-ink">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="text-emerald-700 font-bold uppercase">Free</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & Duties</span>
                <span className="text-ink/50">Included</span>
              </div>

              <div className="border-t border-black/10 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-black uppercase text-ink">Total</span>
                <span className="font-display text-2xl font-black text-ink">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="flex w-full items-center justify-center gap-2 bg-lime py-4 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-white"
            >
              Proceed to Checkout <ArrowRight size={15} />
            </button>

            {/* Perks */}
            <div className="border-t border-black/10 pt-4 space-y-2 text-[11px] text-ink/65">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
                <span>100% Secure Checkout with Razorpay</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-ink/60 shrink-0" />
                <span>Dispatches within 24-48 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={14} className="text-ink/60 shrink-0" />
                <span>7-Day Return and Exchange Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Address Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        totalAmount={totalAmount}
        onOrderPlaced={(order) => {
          setConfirmedOrder(order);
        }}
      />

      {/* Order Confirmed Receipt Modal */}
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />
    </div>
  );
}
