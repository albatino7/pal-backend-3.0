import { Eye, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { openQuickView } from "../productsSlice";

export function formatPrice(price) {
  if (!price || typeof price.amount === "undefined") return "—";
  const symbol = price.currency === "USD" ? "$" : "₹";
  return `${symbol}${Number(price.amount).toLocaleString("en-IN")}`;
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const images = product?.images && product.images.length > 0 ? product.images : [];
  const primaryImage = images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";
  const hoverImage = images[1] || primaryImage;

  const totalStock = product?.sizes?.reduce((acc, curr) => acc + (curr.stock || 0), 0) ?? 0;
  const isOutOfStock = totalStock === 0;

  return (
    <div
      className="group relative flex flex-col bg-white border border-black/5 transition hover:border-black/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#e9e8e3] block"
      >
        <img
          src={isHovered ? hoverImage : primaryImage}
          alt={product.title}
          className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white">
              Sold Out
            </span>
          ) : product.published === false ? (
            <span className="bg-amber-500/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-black">
              Unlisted
            </span>
          ) : null}
          {images.length > 1 && (
            <span className="bg-white/80 backdrop-blur-sm px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-ink/70">
              +{images.length - 1} photos
            </span>
          )}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-2 p-3 transition-transform duration-200 ease-out group-hover:translate-y-0 bg-gradient-to-t from-black/60 to-transparent z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(openQuickView(product));
            }}
            className="flex flex-1 items-center justify-center gap-2 bg-white px-3 py-2.5 text-[9px] font-black uppercase tracking-[0.14em] text-ink shadow-sm transition hover:bg-lime"
          >
            <Eye size={13} /> Quick view
          </button>
          <span
            className="flex size-9 items-center justify-center bg-lime text-ink transition hover:bg-white"
            title="View Details"
          >
            <ShoppingBag size={14} />
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/products/${product._id}`}
            className="font-sans text-xs font-bold uppercase tracking-[0.06em] text-ink line-clamp-1 transition hover:text-ink/60"
            title={product.title}
          >
            {product.title}
          </Link>
        </div>

        <p className="mt-1 font-display text-sm font-black text-ink">
          {formatPrice(product.price)}
        </p>

        {/* Available Sizes preview */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1">
            {product.sizes.map((s) => (
              <span
                key={s.size}
                className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] border ${
                  s.stock > 0
                    ? "border-black/10 text-ink/75 bg-paper"
                    : "border-black/5 text-ink/25 line-through bg-black/[0.02]"
                }`}
                title={s.stock > 0 ? `${s.stock} in stock` : "Out of stock"}
              >
                {s.size}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
