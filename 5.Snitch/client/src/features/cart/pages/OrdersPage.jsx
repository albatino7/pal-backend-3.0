import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../products/components/ProductCard";
import OrderTrackingModal from "../components/OrderTrackingModal";
import { useMyOrders } from "../hooks/useOrders";
import {
  DEFAULT_PRODUCT_IMAGE,
  getProductGalleryThumbnail,
} from "../../../lib/imageOptimization";

function getStatusBadge(status) {
  switch (status) {
    case "pending":
      return {
        text: "Awaiting Seller Approval",
        className: "bg-amber-50 border-amber-200 text-amber-800",
      };
    case "processing":
      return {
        text: "Approved by Seller",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      };
    case "shipped":
      return {
        text: "Dispatched & In Transit",
        className: "bg-purple-50 border-purple-200 text-purple-800",
      };
    case "delivered":
      return {
        text: "Delivered",
        className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      };
    case "cancelled":
      return {
        text: "Cancelled",
        className: "bg-red-50 border-red-200 text-red-800",
      };
    default:
      return {
        text: status,
        className: "bg-paper border-black/10 text-ink",
      };
  }
}

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError, error, refetch } = useMyOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProductItem, setSelectedProductItem] = useState(null);

  const handleOpenTracking = (order, productItem = null) => {
    setSelectedOrder(order);
    setSelectedProductItem(productItem);
  };

  const handleCloseTracking = () => {
    setSelectedOrder(null);
    setSelectedProductItem(null);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl py-16 space-y-6 animate-pulse">
        <div className="h-6 w-40 bg-black/10 rounded-sm" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 bg-white border border-black/10 p-6" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-red-700">
          {error?.response?.data?.message || "Failed to load your orders."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white"
        >
          <RefreshCw size={13} /> Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="mx-auto max-w-4xl py-16 text-center sm:py-24">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-lime text-ink shadow-sm">
          <Package size={24} />
        </span>
        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
          Order History
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-[-0.04em] sm:text-6xl text-ink">
          No Orders Placed Yet.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-xs sm:text-sm leading-6 text-ink/60">
          You haven't placed any orders yet. Discover our fresh drops and build your rotation today.
        </p>
        <Link to="/products" className="action-link mt-8">
          Explore the collection <ArrowRight size={15} />
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-black/[0.08] pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
            <Sparkles size={14} className="text-lime" /> Purchase History & Tracking
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink">
            My Orders ({orders.length})
          </h1>
        </div>

        <Link
          to="/products"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink/60 hover:text-ink transition"
        >
          Explore More Fits <ArrowRight size={13} />
        </Link>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const badge = getStatusBadge(order.status);
          const dateStr = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—";

          return (
            <div
              key={order._id}
              className="border border-black/10 bg-white overflow-hidden shadow-sm hover:border-black/30 transition"
            >
              {/* Order Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-paper p-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black text-ink">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-ink/50 font-medium">
                    <Calendar size={12} /> {dateStr}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border ${badge.className}`}
                  >
                    {badge.text}
                  </span>

                  {/* Payment Pill */}
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                      order.paymentStatus === "paid" ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
                    }`}
                  >
                    ● {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Products Row inside Order */}
              <div className="divide-y divide-black/5 p-4 sm:p-5">
                {order.products?.map((item, idx) => {
                  const prod = item.product;
                  const img =
                    prod?.images?.[0] ||
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80";

                  return (
                    <div
                      key={idx}
                      onClick={() => handleOpenTracking(order, item)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-4 cursor-pointer hover:bg-paper/40 p-2 transition"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getProductGalleryThumbnail(img)}
                          alt=""
                          width={64}
                          height={64}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                          }}
                          className="size-16 object-cover object-top border border-black/10 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs uppercase tracking-tight text-ink group-hover:text-ink/70 transition">
                            {prod?.title || "Product"}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-ink/60 mt-1">
                            <span className="bg-paper px-2 py-0.5 border border-black/10 font-bold uppercase">
                              Size: {item.size}
                            </span>
                            <span>Quantity: {item.quantity}</span>
                          </div>
                          <p className="font-display font-black text-xs text-ink mt-1">
                            {formatPrice(prod?.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenTracking(order, item);
                          }}
                          className="flex items-center gap-1.5 bg-paper border border-black/15 px-3 py-2 text-[9px] font-black uppercase tracking-wider text-ink transition hover:bg-lime hover:border-black"
                        >
                          <Truck size={12} /> Track Dispatch & Delivery
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Card Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-black/10 bg-paper/50 p-4 gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-ink/70 text-[11px]">
                  <MapPin size={13} className="shrink-0 text-ink/40" />
                  <span className="truncate max-w-md">{order.shippingAddress}</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-ink/50 uppercase text-[10px] font-bold">Total Paid:</span>
                  <span className="font-display text-base font-black text-ink">
                    ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracking Modal */}
      <OrderTrackingModal
        order={selectedOrder}
        productItem={selectedProductItem}
        onClose={handleCloseTracking}
      />
    </div>
  );
}
