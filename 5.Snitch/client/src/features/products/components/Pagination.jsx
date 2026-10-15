import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { memo, useMemo } from "react";

function PaginationComponent({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 8,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [8, 12, 24],
  isLoading = false,
}) {
  if (totalPages <= 1 && totalItems <= pageSizeOptions[0]) {
    return null;
  }

  // Calculate items range
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || currentPage * pageSize);

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages, currentPage + 1);

      if (currentPage <= 2) {
        start = 1;
        end = 3;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 2;
        end = totalPages;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const handlePageSelect = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-black/10 pt-6">
      {/* Range Info & Page Size */}
      <div className="flex items-center gap-4 text-xs text-ink/60">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">
          Showing {startItem}–{endItem} {totalItems > 0 ? `of ${totalItems}` : ""} fits
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink/40">
              Per page:
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Items per page"
              className="border border-black/10 bg-white px-2 py-1 text-[10px] font-bold uppercase text-ink focus:border-ink focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          type="button"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => handlePageSelect(1)}
          className="hidden sm:flex size-8 items-center justify-center border border-black/10 bg-white text-ink/60 transition hover:border-black hover:text-ink disabled:opacity-30 disabled:pointer-events-none"
          title="First page"
        >
          <ChevronsLeft size={13} />
        </button>

        {/* Previous page */}
        <button
          type="button"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => handlePageSelect(currentPage - 1)}
          className="flex h-8 items-center gap-1 border border-black/10 bg-white px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-ink transition hover:bg-ink hover:text-white disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft size={13} /> <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) =>
            p === "..." ? (
              <span key={`dots-${idx}`} className="px-1 text-xs text-ink/30 select-none">
                ...
              </span>
            ) : (
              <button
                key={`page-${p}`}
                type="button"
                disabled={isLoading}
                onClick={() => handlePageSelect(p)}
                className={`flex size-8 items-center justify-center text-xs font-black transition ${
                  p === currentPage
                    ? "bg-lime text-ink border-lime shadow-sm"
                    : "border border-black/10 bg-white text-ink/70 hover:border-black hover:text-ink"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next page */}
        <button
          type="button"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => handlePageSelect(currentPage + 1)}
          className="flex h-8 items-center gap-1 border border-black/10 bg-white px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-ink transition hover:bg-ink hover:text-white disabled:opacity-30 disabled:pointer-events-none"
        >
          <span className="hidden sm:inline">Next</span> <ChevronRight size={13} />
        </button>

        {/* Last page */}
        <button
          type="button"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => handlePageSelect(totalPages)}
          className="hidden sm:flex size-8 items-center justify-center border border-black/10 bg-white text-ink/60 transition hover:border-black hover:text-ink disabled:opacity-30 disabled:pointer-events-none"
          title="Last page"
        >
          <ChevronsRight size={13} />
        </button>
      </div>
    </div>
  );
}

export default memo(PaginationComponent);
