import { Link2, AlertTriangle, RotateCw } from "lucide-react";
import useUrlFilter from "../hooks/useUrlFilter";
import UrlCard from "./UrlCard";
import UrlSearchFilter from "./UrlSearchFilter";
import { CardSkeleton } from "../../ui/components/Skeleton";
import EmptyState from "../../ui/components/EmptyState";

export const UrlList = () => {
  const {
    rawUrls,
    filteredUrls,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    searchQuery,
    sortBy,
    setSearchQuery,
    setSortBy,
    resetFilters,
    handleDelete,
    isDeleting,
  } = useUrlFilter();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-col gap-3 sm:gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
              All Shortened Links
            </h2>
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">
            {rawUrls.length} {rawUrls.length === 1 ? "Link" : "Links"}
          </span>
        </div>

        {/* Search and Filters */}
        <UrlSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onRefresh={refetch}
          isRefreshing={isFetching}
          totalCount={rawUrls.length}
          filteredCount={filteredUrls.length}
        />
      </div>

      {/* Content States */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8 text-center text-rose-800">
          <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-rose-500 mb-2" />
          <h3 className="font-semibold text-sm sm:text-base">Failed to load links</h3>
          <p className="mt-1 text-xs text-rose-600 max-w-sm">
            {error?.message || "Could not reach the server. Please verify your backend connection."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Retry Connection
          </button>
        </div>
      ) : filteredUrls.length === 0 ? (
        <EmptyState
          isSearch={Boolean(searchQuery.trim())}
          onReset={resetFilters}
        />
      ) : (
        <div className="space-y-3 sm:space-y-3.5">
          {filteredUrls.map((item) => (
            <UrlCard
              key={item._id || item.shortCode}
              item={item}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlList;
