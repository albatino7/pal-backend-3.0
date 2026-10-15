import { Check, ExternalLink, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { closeQuickView } from "../productsSlice";
import { formatPrice } from "./ProductCard";
import { useCart } from "../../cart/hooks/useCart";
import {
  DEFAULT_PRODUCT_IMAGE,
  getProductDetailImage,
  getProductGalleryThumbnail,
} from "../../../lib/imageOptimization";

export default function ProductDetailModal() {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.quickViewProduct);
  const { addToCart, isAdding } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);
  const [cartError, setCartError] = useState("");

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
  ];

  const handleClose = () => {
    setSelectedSize(null);
    setSelectedImageIdx(0);
    setAddedNotice(false);
    setCartError("");
    dispatch(closeQuickView());
  };

  const handleAddToBag = async () => {
    if (!selectedSize) return;
    setCartError("");
    try {
      await addToCart({
        productId: product._id,
        size: selectedSize,
        quantity: 1,
      });
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    } catch (err) {
      setCartError(err.response?.data?.message || err.message || "Could not add to bag.");
    }
  };

  const currentSizeObj = product.sizes?.find((s) => s.size === selectedSize);
  const totalStock = product.sizes?.reduce((acc, curr) => acc + (curr.stock || 0), 0) ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-black/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center bg-white/80 backdrop-blur border border-black/10 text-ink/70 transition hover:bg-ink hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Image Gallery Column */}
        <div className="md:w-1/2 p-6 flex flex-col items-center bg-[#f7f6f2] border-b md:border-b-0 md:border-r border-black/5">
          <div className="aspect-[3/4] w-full max-h-[420px] overflow-hidden bg-white shadow-inner">
            <img
              src={getProductDetailImage(images[selectedImageIdx])}
              alt={product.title || "Product quick view"}
              width={600}
              height={800}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
              }}
              className="h-full w-full object-cover object-top"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 max-w-full">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative size-14 shrink-0 overflow-hidden border-2 bg-paper transition ${
                    selectedImageIdx === idx ? "border-ink" : "border-black/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={getProductGalleryThumbnail(img)}
                    alt=""
                    width={56}
                    height={56}
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

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/45">
              <span>Snitch Edition</span>
              {totalStock > 0 ? (
                <span className="text-emerald-700 font-bold">• In Stock</span>
              ) : (
                <span className="text-rose-600 font-bold">• Out of Stock</span>
              )}
            </div>

            <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
              {product.title}
            </h2>

            <p className="mt-3 font-display text-2xl font-black text-ink">
              {formatPrice(product.price)}
            </p>

            <p className="mt-4 text-xs leading-relaxed text-ink/65 line-clamp-4">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-6 border-t border-black/10 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/60">
                  Select Size
                </span>
                {currentSizeObj && (
                  <span className="text-[10px] font-medium text-ink/50">
                    {currentSizeObj.stock > 0 ? `${currentSizeObj.stock} left in stock` : "Unavailable"}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes?.map(({ size, stock }) => {
                  const isAvailable = stock > 0;
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-11 px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
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
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3 pt-4 border-t border-black/10">
            {addedNotice && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-800">
                <Check size={14} /> Added to bag successfully!
              </div>
            )}
            {cartError && (
              <div className="bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {cartError}
              </div>
            )}

            <button
              type="button"
              disabled={totalStock === 0 || !selectedSize || isAdding}
              onClick={handleAddToBag}
              className="flex w-full items-center justify-center gap-2 bg-lime px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag size={15} />
              {isAdding ? "Adding..." : !selectedSize ? "Select a Size" : "Add to Bag"}
            </button>

            <Link
              to={`/products/${product._id}`}
              onClick={handleClose}
              className="flex items-center justify-center gap-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink/50 hover:text-ink transition py-1"
            >
              View Full Product Page <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
