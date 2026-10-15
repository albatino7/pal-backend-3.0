import {
  ArrowLeft,
  ArrowRight,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import ProductFilters from "../components/ProductFilters";
import ProductFormModal from "../components/ProductFormModal";
import { usePublishedProducts } from "../hooks/usePublishedProducts";
import { openCreateModal, resetFilters, setLimit, setPage } from "../productsSlice";

function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-black/5 animate-pulse">
      <div className="aspect-[3/4] w-full bg-black/5" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-3/4 bg-black/10 rounded-sm" />
        <div className="h-4 w-1/3 bg-black/10 rounded-sm" />
        <div className="flex gap-1 pt-2">
          <div className="h-4 w-6 bg-black/5 rounded-sm" />
          <div className="h-4 w-6 bg-black/5 rounded-sm" />
          <div className="h-4 w-6 bg-black/5 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { user } = useCurrentUser();
  const isSeller = user?.role === "seller";

  const { page, limit, searchQuery, selectedSize, sortBy } = useSelector(
    (state) => state.products
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    usePublishedProducts({ page, limit });

  const rawProducts = data?.products || [];
  const totalPages = data?.totalPages || 1;

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedSize !== "ALL") {
      list = list.filter((p) =>
        p.sizes?.some((s) => s.size === selectedSize && s.stock > 0)
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return list;
  }, [rawProducts, searchQuery, selectedSize, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-black/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
            <Sparkles size={14} className="text-lime" /> Catalog / 2026 Drop
          </div>
          <h1 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-ink sm:text-5xl">
            The Collection<span className="text-lime">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-ink/60">
            Engineered silhouettes, premium heavyweights, and relaxed fits made for
            everyday movement.
          </p>
        </div>

        {isSeller && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => dispatch(openCreateModal())}
              className="flex items-center gap-2 bg-lime px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-ink transition hover:bg-ink hover:text-white"
            >
              <Plus size={14} /> Add Product
            </button>
            <Link
              to="/seller/dashboard"
              className="flex items-center gap-2 border border-black/15 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition hover:border-black"
            >
              Seller Hub
            </Link>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <ProductFilters totalResults={filteredProducts.length} />

      {/* Product Grid / States */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="my-16 flex flex-col items-center justify-center text-center p-8 border border-red-200 bg-red-50/50">
          <p className="text-xs font-bold uppercase tracking-wider text-red-700">
            {error?.response?.data?.message || error?.message || "Failed to load products"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 flex items-center gap-2 bg-ink px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white hover:bg-black"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="my-16 flex flex-col items-center justify-center text-center p-12 border border-dashed border-black/15">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
            No matches found
          </p>
          <h3 className="mt-2 font-display text-2xl font-black uppercase text-ink">
            No fits available.
          </h3>
          <p className="mt-2 max-w-sm text-xs text-ink/60">
            {searchQuery || selectedSize !== "ALL"
              ? "We couldn't find any products matching your active filters."
              : "No published products are currently available in the store."}
          </p>
          {(searchQuery || selectedSize !== "ALL") && (
            <button
              type="button"
              onClick={() => dispatch(resetFilters())}
              className="mt-6 flex items-center gap-2 bg-lime px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-ink hover:bg-ink hover:text-white"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={data?.total ?? rawProducts.length}
        pageSize={limit}
        onPageChange={(newPage) => dispatch(setPage(newPage))}
        onPageSizeChange={(newLimit) => dispatch(setLimit(newLimit))}
        pageSizeOptions={[8, 12, 16, 24]}
        isLoading={isFetching}
      />

      {/* Modals */}
      <ProductDetailModal />
      <ProductFormModal />
    </div>
  );
}
