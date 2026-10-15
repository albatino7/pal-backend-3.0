import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setSortBy, resetFilters } from "../slices/urlFilterSlice";
import { useUrlsQuery, useDeleteUrlMutation } from "./useUrlQueries";
import useToast from "../../ui/hooks/useToast";

/**
 * Custom hook containing business logic for filtering, sorting,
 * deleting, and computing metrics for the URL list.
 */
export const useUrlFilter = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const searchQuery = useSelector((state) => state.urlFilters.searchQuery);
  const sortBy = useSelector((state) => state.urlFilters.sortBy);

  // TanStack Query for URLs
  const { data: urls = [], isLoading, isError, error, refetch, isFetching } = useUrlsQuery();

  // Delete mutation
  const deleteMutation = useDeleteUrlMutation({
    onSuccess: () => {
      toast.success("Short link deleted successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete short link");
    },
  });

  // Filtered & Sorted URLs
  const filteredUrls = useMemo(() => {
    if (!Array.isArray(urls)) return [];

    let result = [...urls];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.shortCode?.toLowerCase().includes(q) ||
          u.orignalUrl?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "most-clicks") {
        return (b.clicks || 0) - (a.clicks || 0);
      }
      if (sortBy === "least-clicks") {
        return (a.clicks || 0) - (b.clicks || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      // default: newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }, [urls, searchQuery, sortBy]);

  // Aggregate metrics
  const stats = useMemo(() => {
    if (!Array.isArray(urls) || urls.length === 0) {
      return {
        totalUrls: 0,
        totalClicks: 0,
        averageClicks: 0,
        topUrl: null,
      };
    }

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((acc, u) => acc + (u.clicks || 0), 0);
    const averageClicks = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : 0;

    const sortedByClicks = [...urls].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    const topUrl = sortedByClicks[0]?.clicks > 0 ? sortedByClicks[0] : null;

    return {
      totalUrls,
      totalClicks,
      averageClicks,
      topUrl,
    };
  }, [urls]);

  const handleDelete = async (shortCode) => {
    if (window.confirm(`Are you sure you want to delete short link "${shortCode}"?`)) {
      try {
        await deleteMutation.mutateAsync(shortCode);
      } catch {
        // Handled in onError
      }
    }
  };

  return {
    rawUrls: urls,
    filteredUrls,
    stats,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    searchQuery,
    sortBy,
    setSearchQuery: (query) => dispatch(setSearchQuery(query)),
    setSortBy: (sort) => dispatch(setSortBy(sort)),
    resetFilters: () => dispatch(resetFilters()),
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
};

export default useUrlFilter;
