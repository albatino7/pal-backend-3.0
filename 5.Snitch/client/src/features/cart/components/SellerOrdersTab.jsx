import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../products/components/ProductCard";
import { useAllOrders, useUpdateOrderStatus } from "../hooks/useOrders";
import {
  DEFAULT_PRODUCT_IMAGE,
  getProductGalleryThumbnail,
} from "../../../lib/imageOptimization";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function SellerOrdersTab() {
  const { data: orders = [], isLoading, isError, error, refetch } = useAllOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = orders.length;
    const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingFulfillment = orders.filter(
      (o) => o.status === "pending" || o.status === "processing"
    ).length;

    return { total, paidCount: paidOrders.length, totalRevenue, pendingFulfillment };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName = order.user?.name?.toLowerCase() || "";
      const customerEmail = order.user?.email?.toLowerCase() || "";
      const orderId = order._id?.toLowerCase() || "";
      const address = order.shippingAddress?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        customerName.includes(search) ||
        customerEmail.includes(search) ||
        orderId.includes(search) ||
        address.includes(search);

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "ALL" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateStatusMutation.mutateAsync({ orderId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-black/10 p-5 space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/40">
            Total Orders
          </span>
          <p className="font-display text-3xl font-black text-ink">{metrics.total}</p>
        </div>

        <div className="bg-white border border-black/10 p-5 space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-600">
            Total Revenue (Paid)
          </span>
          <p className="font-display text-3xl font-black text-ink">
            ₹{metrics.totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white border border-black/10 p-5 space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-amber-600">
            Pending Dispatch
          </span>
          <p className="font-display text-3xl font-black text-ink">
            {metrics.pendingFulfillment}
          </p>
        </div>

        <div className="bg-white border border-black/10 p-5 space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/40">
            Paid Orders
          </span>
          <p className="font-display text-3xl font-black text-ink">{metrics.paidCount}</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-black/10 p-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, email, address, order #..."
            className="w-full border border-black/10 bg-paper py-2 pl-8 pr-3 text-xs focus:border-ink focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Payment filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            aria-label="Filter by payment status"
            className="border border-black/10 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase text-ink cursor-pointer"
          >
            <option value="ALL">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
          </select>

          {/* Fulfillment status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by order status"
            className="border border-black/10 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase text-ink cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => refetch()}
            className="border border-black/10 p-2 text-ink/50 hover:text-ink hover:border-black"
            title="Refresh orders"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Orders List / Cards */}
      {isLoading ? (
        <div className="py-16 text-center text-xs font-bold uppercase tracking-wider text-ink/40">
          Loading orders...
        </div>
      ) : isError ? (
        <div className="p-8 border border-red-200 bg-red-50 text-center space-y-3">
          <p className="text-xs text-red-700">
            {error?.response?.data?.message || "Failed to load orders"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="bg-ink px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white"
          >
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-black/15 bg-white space-y-4">
          <Package size={32} className="mx-auto text-ink/30" />
          <h3 className="font-display text-xl font-black uppercase text-ink">
            No Orders Found
          </h3>
          <p className="text-xs text-ink/50 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "ALL" || paymentFilter !== "ALL"
              ? "No customer orders match your active search filters."
              : "When customers place orders, full user details, shipping addresses, and items will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const customer = order.user;
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "—";

            return (
              <div
                key={order._id}
                className="border border-black/10 bg-white p-5 space-y-4 shadow-sm hover:border-black/30 transition"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black/10 pb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-ink">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-ink/50 font-medium">
                      <Calendar size={12} /> {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Payment badge */}
                    <span
                      className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>

                    {/* Order Fulfillment Status selector */}
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-ink/40">
                        Status:
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updateStatusMutation.isPending}
                        className="border border-black/15 bg-paper px-2 py-1 text-[10px] font-bold uppercase text-ink focus:border-ink focus:outline-none cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Grid info: Customer Details + Shipping Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-paper/60 p-3.5 border border-black/5 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/45 flex items-center gap-1">
                      <User size={12} /> Customer Information
                    </span>
                    <p className="font-bold text-ink">
                      {customer?.name || "Guest Customer"}
                    </p>
                    {customer?.email && (
                      <p className="text-[11px] text-ink/70 flex items-center gap-1">
                        <Mail size={11} /> {customer.email}
                      </p>
                    )}
                    {order.razorpayPaymentId && (
                      <p className="text-[10px] font-mono text-ink/50 pt-1">
                        Razorpay Payment ID: {order.razorpayPaymentId}
                      </p>
                    )}
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/45 flex items-center gap-1">
                      <MapPin size={12} /> Shipping Address
                    </span>
                    <p className="text-[11px] text-ink/80 leading-relaxed font-medium">
                      {order.shippingAddress}
                    </p>
                  </div>
                </div>

                {/* Ordered Products Items */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/45 block">
                    Ordered Fits ({order.products?.length || 0})
                  </span>
                  <div className="divide-y divide-black/5 border border-black/5 bg-white">
                    {order.products?.map((item, idx) => {
                      const prod = item.product;
                      const img = prod?.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80";

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={getProductGalleryThumbnail(img)}
                              alt=""
                              width={48}
                              height={48}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                              }}
                              className="size-12 object-cover object-top border border-black/10 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-xs text-ink">
                                {prod?.title || "Product"}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-ink/50 mt-0.5">
                                <span className="bg-paper px-1.5 py-0.2 border border-black/10 font-bold uppercase">
                                  Size: {item.size}
                                </span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>

                          <span className="font-display font-black text-xs text-ink">
                            {formatPrice(prod?.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Total */}
                <div className="flex justify-between items-center pt-2 border-t border-black/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                    Grand Total
                  </span>
                  <span className="font-display text-base font-black text-ink">
                    ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
