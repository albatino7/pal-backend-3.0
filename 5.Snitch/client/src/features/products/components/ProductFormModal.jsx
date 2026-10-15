import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProductMutations } from "../hooks/useProductMutations";
import { closeFormModal } from "../productsSlice";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductFormModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.products.isFormModalOpen);
  const editingProduct = useSelector((state) => state.products.editingProduct);
  const isEditing = Boolean(editingProduct);

  const { createMutation, updateMutation } = useProductMutations();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [sizesMap, setSizesMap] = useState(
    ALL_SIZES.reduce((acc, s) => ({ ...acc, [s]: { enabled: true, stock: 10 } }), {})
  );
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title || "");
      setDescription(editingProduct.description || "");
      setAmount(editingProduct.price?.amount ?? "");
      setCurrency(editingProduct.price?.currency || "INR");

      const map = ALL_SIZES.reduce((acc, s) => {
        const found = editingProduct.sizes?.find((sz) => sz.size === s);
        return {
          ...acc,
          [s]: {
            enabled: Boolean(found),
            stock: found ? found.stock : 0,
          },
        };
      }, {});
      setSizesMap(map);
      setExistingImages(editingProduct.images || []);
      setFiles([]);
      setPreviews([]);
    } else {
      setTitle("");
      setDescription("");
      setAmount("");
      setCurrency("INR");
      setSizesMap(
        ALL_SIZES.reduce((acc, s) => ({ ...acc, [s]: { enabled: true, stock: 10 } }), {})
      );
      setExistingImages([]);
      setFiles([]);
      setPreviews([]);
    }
    setValidationError("");
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalCount = (isEditing ? existingImages.length : 0) + files.length + selectedFiles.length;

    if (totalCount > 5) {
      setValidationError("You can upload a maximum of 5 images in total.");
      return;
    }

    setValidationError("");
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    // generate object previews
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewFile = (idx) => {
    const updatedFiles = files.filter((_, i) => i !== idx);
    const updatedPreviews = previews.filter((_, i) => i !== idx);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSizeToggle = (size) => {
    setSizesMap((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        enabled: !prev[size].enabled,
      },
    }));
  };

  const handleStockChange = (size, stockVal) => {
    const num = Math.max(0, parseInt(stockVal, 10) || 0);
    setSizesMap((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        stock: num,
      },
    }));
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Client-side validations
    if (!title.trim() || title.trim().length < 3 || title.trim().length > 100) {
      setValidationError("Title must be between 3 and 100 characters.");
      return;
    }

    if (!description.trim() || description.trim().length < 10 || description.trim().length > 1000) {
      setValidationError("Description must be between 10 and 1000 characters.");
      return;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError("Please enter a valid price greater than 0.");
      return;
    }

    const sizesArray = ALL_SIZES.filter((s) => sizesMap[s].enabled).map((s) => ({
      size: s,
      stock: sizesMap[s].stock,
    }));

    if (sizesArray.length === 0) {
      setValidationError("Please select at least one available size.");
      return;
    }

    if (!isEditing && files.length === 0) {
      setValidationError("Please provide at least one product image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", JSON.stringify({ amount: parsedAmount, currency }));
    formData.append("sizes", JSON.stringify(sizesArray));

    // Append files
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: editingProduct._id, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      dispatch(closeFormModal());
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Failed to save product.";
      setValidationError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[92vh] bg-white border border-black/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40">
              Seller Studio
            </span>
            <h2 className="font-display text-xl font-black uppercase tracking-tight text-ink sm:text-2xl">
              {isEditing ? "Edit Product" : "Create New Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dispatch(closeFormModal())}
            disabled={isSubmitting}
            className="flex size-8 items-center justify-center border border-black/10 text-ink/60 transition hover:bg-ink hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {validationError && (
            <div className="border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {validationError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60 mb-1.5">
              Product Title * (3 - 100 characters)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Heavyweight Boxy Tee"
              className="form-input text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60 mb-1.5">
              Description * (10 - 1000 characters)
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide fit, fabric, and styling details..."
              className="form-input text-xs resize-y"
            />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60 mb-1.5">
                Price Amount *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1499"
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="form-input text-xs cursor-pointer"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Sizes & Stock */}
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60 mb-2">
              Size Inventory Matrix *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ALL_SIZES.map((size) => {
                const conf = sizesMap[size] || { enabled: false, stock: 0 };
                return (
                  <div
                    key={size}
                    className={`flex items-center justify-between border p-2.5 transition ${
                      conf.enabled ? "border-black/30 bg-paper" : "border-black/10 bg-white opacity-60"
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={conf.enabled}
                        onChange={() => handleSizeToggle(size)}
                        className="accent-ink"
                      />
                      <span className="text-xs font-black uppercase">{size}</span>
                    </label>

                    {conf.enabled && (
                      <input
                        type="number"
                        min="0"
                        value={conf.stock}
                        onChange={(e) => handleStockChange(size, e.target.value)}
                        className="w-16 border border-black/15 bg-white px-2 py-1 text-center text-xs font-semibold focus:border-ink focus:outline-none"
                        title="Stock quantity"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image Uploads */}
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60 mb-1.5">
              Product Images (Max 5 total)
            </label>

            {/* Existing images (in edit mode) */}
            {isEditing && existingImages.length > 0 && (
              <div className="mb-3">
                <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-ink/40 block mb-1">
                  Current Images:
                </span>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative size-16 border border-black/10 group">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New File Previews */}
            {previews.length > 0 && (
              <div className="mb-3">
                <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-ink/40 block mb-1">
                  New Images to Upload:
                </span>
                <div className="flex flex-wrap gap-2">
                  {previews.map((previewUrl, idx) => (
                    <div key={idx} className="relative size-16 border border-black/10 group">
                      <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        title="Remove upload"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/15 bg-paper/50 p-6 transition hover:border-black cursor-pointer">
              <ImagePlus size={24} className="text-ink/40 mb-2" />
              <span className="text-xs font-bold text-ink">Click to upload images</span>
              <span className="text-[10px] text-ink/40 mt-1">PNG, JPG, WEBP up to 5MB</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10">
            <button
              type="button"
              onClick={() => dispatch(closeFormModal())}
              disabled={isSubmitting}
              className="border border-black/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-lime px-6 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-white disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Save Changes"
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
