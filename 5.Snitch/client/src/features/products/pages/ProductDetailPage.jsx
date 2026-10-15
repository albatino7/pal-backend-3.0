import {
  ArrowLeft,
  Check,
  Edit,
  Eye,
  EyeOff,
  Package,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ProductCard, { formatPrice } from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import ProductFormModal from "../components/ProductFormModal";
import { useProductDetails } from "../hooks/useProductDetails";
import { useProductMutations } from "../hooks/useProductMutations";
import { usePublishedProducts } from "../hooks/usePublishedProducts";
import { openDeleteModal, openEditModal } from "../productsSlice";
import { useCart } from "../../cart/hooks/useCart";
import {
  DEFAULT_PRODUCT_IMAGE,
  getProductDetailImage,
  getProductGalleryThumbnail,
} from "../../../lib/imageOptimization";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useCurrentUser();

  const { data: product, isLoading, isError, error } = useProductDetails(id);
  const { data: publishedData } = usePublishedProducts({ page: 1, limit: 12 });
  const { togglePublishMutation } = useProductMutations();
  const { addToCart, isAdding } = useCart();

  const isFormModalOpen = useSelector((state) => state.products.isFormModalOpen);
  const isQuickViewOpen = useSelector((state) => Boolean(state.products.quickViewProduct));
  const isDeleteModalOpen = useSelector((state) => Boolean(state.products.deletingProduct));

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImageIdx(0);
    setSelectedSize(null);
    setAddedNotice(false);
  }, [id]);

  const similarProducts = useMemo(() => {
    if (!product || !publishedData?.products) return [];

    const otherProducts = publishedData.products.filter(
      (p) => p._id !== product._id
    );

    const currentPrice = product.price?.amount || 0;
    const currentTitleWords = product.title?.toLowerCase().split(/\s+/) || [];

    const scored = otherProducts.map((item) => {
      let score = 0;
      const itemTitle = item.title?.toLowerCase() || "";
      currentTitleWords.forEach((word) => {
        if (word.length > 2 && itemTitle.includes(word)) {
          score += 3;
        }
      });

      const itemPrice = item.price?.amount || 0;
      const priceDiff = Math.abs(currentPrice - itemPrice);
      if (priceDiff < 500) score += 2;
      else if (priceDiff < 1000) score += 1;

      const itemSellerId = typeof item.seller === "object" ? item.seller?._id : item.seller;
      const currentSellerId = typeof product.seller === "object" ? product.seller?._id : product.seller;
      if (itemSellerId && currentSellerId && itemSellerId === currentSellerId) {
        score += 2;
      }

      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.item).slice(0, 4);
  }, [product, publishedData]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl py-12 animate-pulse space-y-8">
        <div className="h-4 w-40 bg-black/10 rounded-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] w-full bg-black/5" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-black/10 rounded-sm" />
            <div className="h-6 w-1/4 bg-black/10 rounded-sm" />
            <div className="h-20 w-full bg-black/5 rounded-sm" />
            <div className="h-10 w-full bg-black/10 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-black uppercase text-ink">
          Product Not Found
        </h2>
        <p className="text-xs text-ink/60">
          {error?.response?.data?.message || "The product you're looking for does not exist or has been removed."}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-lime px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-ink hover:bg-ink hover:text-white"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
  ];

  const currentSizeObj = product.sizes?.find((s) => s.size === selectedSize);
  const totalStock = product.sizes?.reduce((acc, curr) => acc + (curr.stock || 0), 0) ?? 0;
  const isOutOfStock = totalStock === 0;

  // Check if current user is the seller
  const sellerId = typeof product.seller === "object" ? product.seller?._id : product.seller;
  const isOwner = user && (user.id === sellerId || user._id === sellerId);

  const handleAddToBag = async () => {
    if (!selectedSize) return;
    setCartError("");
    try {
      await addToCart({
        productId: product._id,
        size: selectedSize,
        quantity,
      });
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3000);
    } catch (err) {
      setCartError(err.response?.data?.message || err.message || "Failed to add to bag.");
    }
  };

  const handleTogglePublish = async () => {
    await togglePublishMutation.mutateAsync({
      id: product._id,
      isCurrentlyPublished: product.published,
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Breadcrumb / Navigation */}
      <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
          <Link to="/home" className="hover:text-ink transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-ink transition">Shop</Link>
          <span>/</span>
          <span className="text-ink truncate max-w-xs">{product.title}</span>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50 hover:text-ink transition"
        >
          <ArrowLeft size={13} /> Back
        </button>
      </div>

      {/* Seller Management Banner (if owner) */}
      {isOwner && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f0eee4] border border-black/10 p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center bg-ink text-lime rounded-full">
              <Sparkles size={13} />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-ink">
                You own this product listing
              </p>
              <p className="text-[9px] text-ink/60">
                Status: {product.published ? "Published (Live for customers)" : "Unlisted (Draft)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePublish}
              disabled={togglePublishMutation.isPending}
              className="flex items-center gap-1.5 border border-black/15 bg-white px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-ink hover:border-black"
            >
              {product.published ? <EyeOff size={13} /> : <Eye size={13} />}
              {product.published ? "Unlist Product" : "List Product"}
            </button>
            <button
              type="button"
              onClick={() => dispatch(openEditModal(product))}
              className="flex items-center gap-1.5 bg-ink text-white px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] hover:bg-black"
            >
              <Edit size={13} /> Edit
            </button>
            <button
              type="button"
              onClick={() => dispatch(openDeleteModal(product))}
              className="flex items-center gap-1.5 border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] hover:bg-red-100"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e9e8e3] border border-black/10 shadow-sm">
            <img
              src={getProductDetailImage(images[activeImageIdx])}
              alt={product.title || "Product image"}
              width={900}
              height={1200}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
              }}
              className="h-full w-full object-cover object-top transition duration-300"
            />
            {isOutOfStock && (
              <span className="absolute left-4 top-4 bg-black/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                Sold Out
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`size-20 shrink-0 overflow-hidden border-2 bg-paper transition ${
                    activeImageIdx === idx ? "border-ink" : "border-black/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={getProductGalleryThumbnail(img)}
                    alt=""
                    width={80}
                    height={80}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                    }}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
                Snitch Streetwear
              </span>
              <h1 className="mt-1 font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink">
                {product.title}
              </h1>
              <p className="mt-3 font-display text-3xl font-black text-ink">
                {formatPrice(product.price)}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-ink/70">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="border-t border-black/10 pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/60">
                  Select Size
                </span>
                {currentSizeObj && (
                  <span className="text-[10px] font-medium text-ink/50">
                    {currentSizeObj.stock > 0
                      ? `${currentSizeObj.stock} units available`
                      : "Sold out"}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(({ size, stock }) => {
                  const isAvailable = stock > 0;
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      className={`min-w-12 px-3 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                        isSelected
                          ? "bg-lime text-ink border-lime shadow-sm"
                          : isAvailable
                          ? "border border-black/15 bg-white text-ink hover:border-black"
                          : "border border-black/5 bg-black/[0.03] text-black/25 line-through cursor-not-allowed"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Bag CTA */}
            <div className="space-y-3 pt-2">
              {addedNotice && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-xs font-semibold text-emerald-800">
                  <Check size={15} /> Added to your bag!
                </div>
              )}
              {cartError && (
                <div className="bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                  {cartError}
                </div>
              )}

              <button
                type="button"
                disabled={isOutOfStock || !selectedSize || isAdding}
                onClick={handleAddToBag}
                className="flex w-full items-center justify-center gap-3 bg-lime px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag size={16} />
                {isAdding
                  ? "Adding to Bag..."
                  : !selectedSize
                  ? "Select a Size to Add"
                  : isOutOfStock
                  ? "Out of Stock"
                  : "Add to Bag"}
              </button>
            </div>

            {/* Guarantees & Features */}
            <div className="border-t border-black/10 pt-5 space-y-3 text-xs text-ink/65">
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-ink/60" />
                <span>Complimentary express delivery across India</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={16} className="text-ink/60" />
                <span>Hassle-free 7-day exchanges & returns</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-ink/60" />
                <span>100% Authentic verified garment</span>
              </div>
            </div>

            {/* Seller Info Card */}
            {product.seller && typeof product.seller === "object" && (
              <div className="border border-black/10 bg-white p-4 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink/40 block">
                  Sold By
                </span>
                <p className="text-xs font-bold text-ink">
                  {product.seller.name || "Snitch Verified Seller"}
                </p>
                {product.seller.email && (
                  <p className="text-[10px] text-ink/50">{product.seller.email}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="border-t border-black/10 pt-12 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
                Complete the Rotation
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
                Similar Products<span className="text-lime">.</span>
              </h2>
            </div>
            <Link
              to="/products"
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/60 hover:text-ink hover:underline decoration-lime decoration-2 underline-offset-4"
            >
              View All Fits →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {similarProducts.map((simProduct, index) => (
              <ProductCard
                key={simProduct._id}
                product={simProduct}
                priority={index < 2}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals for Edit, Delete and Quick View (only mounted when active) */}
      {isQuickViewOpen && <ProductDetailModal />}
      {isFormModalOpen && <ProductFormModal />}
      {isDeleteModalOpen && <DeleteConfirmModal />}
    </div>
  );
}
