import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../products/components/ProductCard";

export default function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }) {
  const product = item.product;
  if (!product) return null;

  const currentSizeObj = product.sizes?.find((s) => s.size === item.size);
  const maxStock = currentSizeObj?.stock ?? 10;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const image = images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80";

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity({
        productId: product._id,
        size: item.size,
        quantity: item.quantity - 1,
      });
    } else {
      onRemove({ productId: product._id, size: item.size });
    }
  };

  const handleIncrease = () => {
    if (item.quantity < maxStock) {
      onUpdateQuantity({
        productId: product._id,
        size: item.size,
        quantity: item.quantity + 1,
      });
    }
  };

  const itemTotal = (product.price?.amount || 0) * item.quantity;

  return (
    <div className="flex gap-4 p-4 border border-black/10 bg-white hover:border-black/20 transition">
      {/* Thumbnail */}
      <Link
        to={`/products/${product._id}`}
        className="size-24 shrink-0 overflow-hidden bg-paper border border-black/5"
      >
        <img
          src={image}
          alt={product.title}
          className="h-full w-full object-cover object-top"
        />
      </Link>

      {/* Info & Controls */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/products/${product._id}`}
              className="font-bold text-xs uppercase tracking-[0.06em] text-ink hover:underline line-clamp-1"
            >
              {product.title}
            </Link>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-ink/60">
              <span className="font-semibold uppercase tracking-wider bg-paper px-2 py-0.5 border border-black/10">
                Size: {item.size}
              </span>
              <span className="font-bold text-ink">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onRemove({ productId: product._id, size: item.size })}
            className="text-ink/40 hover:text-red-600 transition p-1"
            title="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Quantity and Subtotal */}
        <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-2">
          {/* Counter */}
          <div className="flex items-center border border-black/15 bg-paper">
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleDecrease}
              className="flex size-7 items-center justify-center text-ink/70 hover:bg-white transition disabled:opacity-40"
              title="Decrease quantity"
            >
              <Minus size={11} />
            </button>
            <span className="w-8 text-center text-xs font-bold text-ink">
              {item.quantity}
            </span>
            <button
              type="button"
              disabled={isUpdating || item.quantity >= maxStock}
              onClick={handleIncrease}
              className="flex size-7 items-center justify-center text-ink/70 hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
              title={item.quantity >= maxStock ? "Maximum stock reached" : "Increase quantity"}
            >
              <Plus size={11} />
            </button>
          </div>

          <span className="font-display text-sm font-black text-ink">
            {product.price?.currency === "USD" ? "$" : "₹"}
            {itemTotal.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
