import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Package,
  PackageCheck,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../products/components/ProductCard";

const STEPS = [
  {
    key: "placed",
    label: "Order Placed",
    desc: "Order & payment verified",
    icon: CheckCircle2,
  },
  {
    key: "processing",
    label: "Approved by Seller",
    desc: "Seller accepted & packed fits",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Dispatched",
    desc: "Handed over to courier",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Package delivered at doorstep",
    icon: PackageCheck,
  },
];

function getActiveStepIndex(status) {
  switch (status) {
    case "pending":
      return 0;
    case "processing":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    default:
      return 0;
  }
}

export default function OrderTrackingModal({ order, productItem, onClose }) {
  if (!order) return null;

  const isCancelled = order.status === "cancelled";
  const activeStepIdx = getActiveStepIndex(order.status);

  // If a specific product was clicked, focus on it; otherwise show first product
  const activeProduct =
    productItem || (order.products && order.products[0]);
  const productData = activeProduct?.product;

  const sellerName =
    productData?.seller && typeof productData.seller === "object"
      ? productData.seller.name
      : "Snitch Merchant";

  const sellerEmail =
    productData?.seller && typeof productData.seller === "object"
      ? productData.seller.email
      : null;

  const image =
    productData?.images?.[0] ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[92vh] bg-white border border-black/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 bg-paper">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40">
              Live Fulfillment Status
            </span>
            <h2 className="font-display text-xl font-black uppercase text-ink">
              Track Dispatch & Delivery
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center border border-black/10 text-ink/60 transition hover:bg-ink hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-paper/60 p-4 border border-black/5 text-xs">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-ink/45 block">
                Order ID
              </span>
              <span className="font-mono font-bold text-ink">
                #{order._id.slice(-8).toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-ink/45 block">
                Placed On
              </span>
              <span className="text-ink font-medium">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-ink/45 block">
                Payment
              </span>
              <span
                className={`font-black uppercase text-[10px] ${
                  order.paymentStatus === "paid" ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                ● {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          {isCancelled ? (
            <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <div>
                <p className="font-bold uppercase tracking-wider">Order Cancelled</p>
                <p className="text-[11px] text-red-600 mt-0.5">
                  This order was cancelled. If you were charged, a refund is initiated to your original payment method.
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-black/10 p-5 bg-white space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-ink">
                  Fulfillment Progress
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-lime text-ink">
                  Current Status: {order.status}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx <= activeStepIdx;
                  const isCurrent = idx === activeStepIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`flex size-11 items-center justify-center rounded-full border-2 transition ${
                          isCurrent
                            ? "bg-lime border-ink text-ink shadow-md"
                            : isDone
                            ? "bg-ink border-ink text-white"
                            : "bg-paper border-black/15 text-ink/30"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div>
                        <p
                          className={`text-xs font-black uppercase tracking-tight ${
                            isDone ? "text-ink" : "text-ink/40"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[10px] text-ink/50 mt-0.5 leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-black/5 pt-3 flex items-center gap-2 text-[10px] text-ink/60 bg-paper p-3">
                <Clock size={14} className="text-ink/60 shrink-0" />
                <span>
                  {order.status === "pending" && "Seller has received your order and will approve and dispatch shortly."}
                  {order.status === "processing" && "Seller has approved your order and is currently packing the items."}
                  {order.status === "shipped" && "Dispatched! Your shipment is with the logistics partner and in transit."}
                  {order.status === "delivered" && "Package successfully delivered! Enjoy your new fits."}
                </span>
              </div>
            </div>
          )}

          {/* Focused Product Info Card */}
          {productData && (
            <div className="border border-black/10 bg-white p-4 space-y-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/40 block">
                Item Details
              </span>

              <div className="flex items-center gap-4">
                <img
                  src={image}
                  alt={productData.title}
                  className="size-20 object-cover object-top border border-black/10 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-ink truncate">
                    {productData.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-ink/60 mt-1">
                    <span className="font-bold uppercase bg-paper px-2 py-0.5 border border-black/10">
                      Size: {activeProduct.size}
                    </span>
                    <span>Quantity: {activeProduct.quantity}</span>
                  </div>
                  <p className="font-display font-black text-sm text-ink mt-1.5">
                    {formatPrice(productData.price)}
                  </p>
                </div>

                <Link
                  to={`/products/${productData._id}`}
                  className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-ink/60 hover:text-ink border border-black/10 p-2"
                  title="View Product Page"
                >
                  <ExternalLink size={13} />
                </Link>
              </div>

              {/* Seller Dispatch Note */}
              <div className="bg-paper/70 p-3 border border-black/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink/40 block">
                    Fulfilled & Approved By:
                  </span>
                  <p className="font-bold text-ink">{sellerName}</p>
                  {sellerEmail && <p className="text-[10px] text-ink/50">{sellerEmail}</p>}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold uppercase">
                  <ShieldCheck size={14} /> Verified Seller
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address Destination */}
          <div className="border border-black/10 bg-white p-4 space-y-1 text-xs">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/40 flex items-center gap-1">
              <MapPin size={12} /> Shipping Address
            </span>
            <p className="text-ink/80 leading-relaxed font-medium pt-1">
              {order.shippingAddress}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-black/10 px-6 py-4 bg-paper">
          <button
            type="button"
            onClick={onClose}
            className="bg-ink px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white hover:bg-black transition"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
