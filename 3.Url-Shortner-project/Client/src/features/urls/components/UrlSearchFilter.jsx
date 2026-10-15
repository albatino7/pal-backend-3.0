import { Search, RotateCw, ArrowUpDown, X } from "lucide-react";

export const UrlSearchFilter = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onRefresh,
  isRefreshing,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-md">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="h-4 w-4" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by code or destination URL..."
          className="w-full rounded-xl border border-slate-300 bg-white py-2 sm:py-2.5 pl-10 pr-9 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Sort & Actions - Full width row on mobile */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        <div className="flex flex-1 sm:flex-initial items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="hidden sm:inline text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="cursor-pointer bg-transparent text-slate-800 font-semibold focus:outline-none w-full"
          >
            <option value="newest">Newest</option>
            <option value="most-clicks">Most Clicks</option>
            <option value="least-clicks">Least Clicks</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh URL list"
          className="flex items-center justify-center rounded-xl border border-slate-300 bg-white p-2.5 text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-50 shrink-0"
          aria-label="Refresh list"
        >
          <RotateCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
        </button>

        <div className="text-[11px] sm:text-xs font-medium text-slate-500 shrink-0 pl-1">
          {filteredCount === totalCount ? (
            <span>{totalCount} links</span>
          ) : (
            <span>
              {filteredCount}/{totalCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlSearchFilter;
