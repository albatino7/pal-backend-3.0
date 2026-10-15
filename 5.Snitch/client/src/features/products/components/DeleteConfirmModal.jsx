import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProductMutations } from "../hooks/useProductMutations";
import { closeDeleteModal } from "../productsSlice";

export default function DeleteConfirmModal() {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.deletingProduct);
  const { deleteMutation } = useProductMutations();
  const [error, setError] = useState("");

  if (!product) return null;

  const handleDelete = async () => {
    try {
      setError("");
      await deleteMutation.mutateAsync(product._id);
      dispatch(closeDeleteModal());
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete product."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white p-6 border border-black/10 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-red-600">
          <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-black uppercase text-ink">
              Delete Product
            </h3>
            <p className="text-[10px] uppercase tracking-wider text-ink/40">
              Irreversible action
            </p>
          </div>
        </div>

        <p className="text-xs text-ink/70 leading-relaxed">
          Are you sure you want to permanently delete{" "}
          <span className="font-bold text-ink">"{product.title}"</span>? This will remove
          it from the catalog and cannot be undone.
        </p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10">
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() => dispatch(closeDeleteModal())}
            className="border border-black/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteMutation.isPending && <Loader2 size={13} className="animate-spin" />}
            {deleteMutation.isPending ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
