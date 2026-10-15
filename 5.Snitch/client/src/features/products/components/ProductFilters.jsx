import { ArrowDownUp, RotateCcw, Search, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilters,
  setSearchQuery,
  setSelectedSize,
  setSortBy,
} from "../productsSlice";

const SIZES = ["ALL", "XS", "S", "M", "L", "XL", "XXL"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Drops" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

function ProductFiltersComponent({ totalResults = 0 }) {
  const dispatch = useDispatch();

  // Granular selectors to avoid re-rendering on modal/pagination changes
  const reduxSearchQuery = useSelector((state) => state.products.searchQuery);
  const selectedSize = useSelector((state) => state.products.selectedSize);
  const sortBy = useSelector((state) => state.products.sortBy);

  // Local state for instant input responsiveness (INP < 50ms)
  const [localSearch, setLocalSearch] = useState(reduxSearchQuery);
  const debounceTimerRef = useRef(null);

  // Keep local search synchronized if Redux search changes externally (e.g. Reset button)
  useEffect(() => {
    setLocalSearch(reduxSearchQuery);
  }, [reduxSearchQuery]);

  const handleSearchChange = (val) => {
    setLocalSearch(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      dispatch(setSearchQuery(val));
    }, 250);
  };

  const handleClearSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setLocalSearch("");
    dispatch(setSearchQuery(""));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const hasActiveFilters =
    reduxSearchQuery !== "" || selectedSize !== "ALL" || sortBy !== "newest";

  return (
    <div className="space-y-4 border-b border-black/[0.08] pb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search fits, styles, fabrics..."
            className="w-full border border-black/10 bg-white/70 py-2.5 pl-9 pr-8 text-xs placeholder:text-ink/35 focus:border-ink focus:bg-white focus:outline-none"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort & Reset Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-ink/40">
              <ArrowDownUp size={13} />
            </span>
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              aria-label="Sort products by"
              className="appearance-none border border-black/10 bg-white/70 py-2.5 pl-8 pr-7 text-xs font-semibold uppercase tracking-[0.06em] text-ink focus:border-ink focus:bg-white focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current);
                }
                setLocalSearch("");
                dispatch(resetFilters());
              }}
              className="flex items-center gap-1.5 border border-black/10 bg-white/50 px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink/60 transition hover:bg-ink hover:text-white"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Size Pills & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ink/45">
            Size:
          </span>
          {SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => dispatch(setSelectedSize(size))}
                className={`min-w-8 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] transition ${
                  isSelected
                    ? "bg-lime text-ink font-black shadow-sm"
                    : "border border-black/10 bg-white/70 text-ink/65 hover:border-black/30 hover:text-ink"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/50">
          Showing {totalResults} {totalResults === 1 ? "Product" : "Products"}
        </span>
      </div>
    </div>
  );
}

export default memo(ProductFiltersComponent);

