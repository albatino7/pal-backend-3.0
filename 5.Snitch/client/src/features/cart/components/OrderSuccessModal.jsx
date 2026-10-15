import { CheckCircle2, PackageCheck, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderSuccessModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative flex flex-col w-full max-w-lg bg-white border border-black/10 shadow-2xl p-6 sm:p-8 space-y-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-lime text-ink shadow-sm">
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-lime-700 bg-lime/30 px-3 py-1">
            Payment Verified & Paid
          </span>
          <h2 className="mt-3 font-display text-3xl font-black uppercase text-ink">
            Order Confirmed!
          </h2>
          <p className="mt-2 text-xs text-ink/60">
            Thank you for shopping with Snitch. Your fits are getting prepped for shipment.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="border border-black/10 bg-paper p-5 text-left space-y-3 text-xs">
          <div className="flex justify-between border-b border-black/10 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Order Reference</span>
            <span className="font-mono font-bold text-ink">#{order._id?.slice(-8).toUpperCase()}</span>
          </div>

          {order.razorpayPaymentId && (
            <div className="flex justify-between border-b border-black/10 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Razorpay Payment ID</span>
              <span className="font-mono text-ink text-[11px]">{order.razorpayPaymentId}</span>
            </div>
          )}

          <div className="flex justify-between border-b border-black/10 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Total Paid</span>
            <span className="font-display font-black text-ink">
              ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50 block mb-1">
              Delivery Address:
            </span>
            <p className="text-[11px] text-ink/80 leading-relaxed font-medium">
              {order.shippingAddress}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/orders"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-lime py-3.5 text-[11px] font-black uppercase tracking-[0.14em] text-ink hover:bg-white border border-black/10 transition"
          >
            <PackageCheck size={14} /> View in My Orders
          </Link>
          <Link
            to="/products"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-ink py-3.5 text-[11px] font-black uppercase tracking-[0.14em] text-white hover:bg-black transition"
          >
            <ShoppingBag size={14} /> Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
