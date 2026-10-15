import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
  Package,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Pagination from "../components/Pagination";
import { formatPrice } from "../components/ProductCard";
import ProductFormModal from "../components/ProductFormModal";
import { useProductMutations } from "../hooks/useProductMutations";
import { useSellerProducts } from "../hooks/useSellerProducts";
import { openCreateModal, openDeleteModal, openEditModal } from "../productsSlice";
import SellerOrdersTab from "../../cart/components/SellerOrdersTab";
import { useAllOrders } from "../../cart/hooks/useOrders";
import {
  DEFAULT_PRODUCT_IMAGE,
  getProductGalleryThumbnail,
} from "../../../lib/imageOptimization";

export default function SellerDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useCurrentUser();
  const isSeller = user?.role === "seller";

  const { data: products = [], isLoading, isError, error, refetch } = useSellerProducts();
  const { data: orders = [] } = useAllOrders();
  const { togglePublishMutation } = useProductMutations();

  const isFormModalOpen = useSelector((state) => state.products.isFormModalOpen);
  const isDeleteModalOpen = useSelector((state) => Boolean(state.products.deletingProduct));

  const [activeTab, setActiveTab] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = products.length;
    const publishedCount = products.filter((p) => p.published).length;
    const unlistedCount = total - publishedCount;
    const totalStock = products.reduce((acc, p) => {
      const pStock = p.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) ?? 0;
      return acc + pStock;
    }, 0);

    return { total, publishedCount, unlistedCount, totalStock };
  }, [products]);

  // Filtered list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchTerm ||
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && p.published) ||
        (statusFilter === "UNLISTED" && !p.published);

      return matchSearch && matchStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  if (!isSeller) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertCircle size={24} />
        </div>
        <h2 className="font-display text-2xl font-black uppercase text-ink">
          Seller Access Required
        </h2>
        <p className="text-xs text-ink/65 leading-relaxed">
          Your account does not have seller privileges. If you are an authorized seller,
          please sign in with your seller credentials.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-lime px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-ink hover:bg-ink hover:text-white"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-black/[0.08] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
            <Sparkles size={14} className="text-lime" /> Merchant Studio
          </div>
          <h1 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-ink sm:text-5xl">
            Seller Dashboard<span className="text-lime">.</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-ink/60">
            Manage your drops, track inventory levels, and control catalog publishing in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(openCreateModal())}
          className="flex items-center gap-2 bg-lime px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-white"
        >
          <Plus size={15} /> Add New Product
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-black/10">
        <button
          type="button"
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 pb-3 text-xs font-black uppercase tracking-wider transition relative ${
            activeTab === "inventory"
              ? "text-ink after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-lime"
              : "text-ink/40 hover:text-ink"
          }`}
        >
          <Layers size={14} /> Catalog & Stock
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 pb-3 text-xs font-black uppercase tracking-wider transition relative ${
            activeTab === "orders"
              ? "text-ink after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-lime"
              : "text-ink/40 hover:text-ink"
          }`}
        >
          <Package size={14} /> Customer Orders & Shipping
          {orders.length > 0 && (
            <span className="bg-lime text-ink px-1.5 py-0.2 text-[9px] font-black rounded-full">
              {orders.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "orders" ? (
        <SellerOrdersTab />
      ) : (
        <>
          {/* KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-black/10 p-5 space-y-1">
          <div className="flex items-center justify-between text-ink/40">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em]">
              Total Products
            </span>
            <Layers size={16} />
          </div>
          <p className="font-display text-3xl font-black text-ink">{stats.total}</p>
        </div>

        <div className="bg-white border border-black/10 p-5 space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em]">
              Live in Store
            </span>
            <CheckCircle2 size={16} />
          </div>
          <p className="font-display text-3xl font-black text-ink">{stats.publishedCount}</p>
        </div>

        <div className="bg-white border border-black/10 p-5 space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em]">
              Unlisted / Drafts
            </span>
            <Tag size={16} />
          </div>
          <p className="font-display text-3xl font-black text-ink">{stats.unlistedCount}</p>
        </div>

        <div className="bg-white border border-black/10 p-5 space-y-1">
          <div className="flex items-center justify-between text-ink/40">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em]">
              Total Stock Units
            </span>
            <Package size={16} />
          </div>
          <p className="font-display text-3xl font-black text-ink">{stats.totalStock}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-black/10 p-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full border border-black/10 bg-paper py-2 pl-8 pr-3 text-xs focus:border-ink focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "PUBLISHED", "UNLISTED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] transition ${
                statusFilter === st
                  ? "bg-ink text-lime"
                  : "border border-black/10 bg-white text-ink/65 hover:border-black"
              }`}
            >
              {st}
            </button>
          ))}
          <button
            type="button"
            onClick={() => refetch()}
            className="border border-black/10 p-2 text-ink/50 hover:text-ink hover:border-black"
            title="Refresh list"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="py-16 text-center text-xs font-bold uppercase tracking-wider text-ink/40">
          Loading catalog...
        </div>
      ) : isError ? (
        <div className="p-8 border border-red-200 bg-red-50 text-center space-y-3">
          <p className="text-xs text-red-700">
            {error?.response?.data?.message || "Failed to load seller catalog"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="bg-ink px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white"
          >
            Retry
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-black/15 bg-white space-y-4">
          <Package size={32} className="mx-auto text-ink/30" />
          <h3 className="font-display text-xl font-black uppercase text-ink">
            No products found
          </h3>
          <p className="text-xs text-ink/50 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "ALL"
              ? "No products match your current search filters."
              : "You haven't added any products to your catalog yet."}
          </p>
          <button
            type="button"
            onClick={() => dispatch(openCreateModal())}
            className="inline-flex items-center gap-2 bg-lime px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-ink hover:bg-ink hover:text-white"
          >
            <Plus size={14} /> Create Your First Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-black/10">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/10 bg-paper text-[9px] font-bold uppercase tracking-[0.16em] text-ink/50">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Inventory Matrix</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {paginatedProducts.map((p) => {
                const img =
                  p.images?.[0] ||
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80";
                const totalStock =
                  p.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) ?? 0;

                return (
                  <tr key={p._id} className="hover:bg-paper/50 transition">
                    {/* Product item & thumbnail */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductGalleryThumbnail(img)}
                          alt=""
                          width={56}
                          height={56}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                          }}
                          className="size-14 object-cover object-top border border-black/10 shrink-0"
                        />
                        <div className="max-w-xs">
                          <Link
                            to={`/products/${p._id}`}
                            className="font-bold text-ink hover:underline line-clamp-1"
                          >
                            {p.title}
                          </Link>
                          <p className="text-[10px] text-ink/50 line-clamp-1 mt-0.5">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-display font-black text-ink">
                      {formatPrice(p.price)}
                    </td>

                    {/* Sizes breakdown */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.sizes?.map((sz) => (
                          <span
                            key={sz.size}
                            className={`px-1.5 py-0.5 text-[8px] font-bold uppercase border ${
                              sz.stock > 0
                                ? "border-black/15 bg-paper text-ink"
                                : "border-black/5 bg-black/[0.02] text-black/25 line-through"
                            }`}
                          >
                            {sz.size}: {sz.stock}
                          </span>
                        ))}
                      </div>
                      <span className="block mt-1 text-[9px] text-ink/40 font-semibold">
                        Total: {totalStock} units
                      </span>
                    </td>

                    {/* Status Toggle badge */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: p._id,
                            isCurrentlyPublished: p.published,
                          })
                        }
                        disabled={togglePublishMutation.isPending}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] border transition ${
                          p.published
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                            : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                        }`}
                        title="Click to toggle status"
                      >
                        {p.published ? <Eye size={11} /> : <EyeOff size={11} />}
                        {p.published ? "Published" : "Unlisted"}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/products/${p._id}`}
                          className="border border-black/10 p-2 text-ink/60 hover:text-ink hover:border-black transition"
                          title="View Product Page"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => dispatch(openEditModal(p))}
                          className="border border-black/10 p-2 text-ink/60 hover:text-ink hover:border-black transition"
                          title="Edit Product"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch(openDeleteModal(p))}
                          className="border border-red-200 bg-red-50/50 p-2 text-red-600 hover:bg-red-100 transition"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[6, 12, 24]}
        />
      )}
        </>
      )}

      {/* Modals (only mounted when active) */}
      {isFormModalOpen && <ProductFormModal />}
      {isDeleteModalOpen && <DeleteConfirmModal />}
    </div>
  );
}
