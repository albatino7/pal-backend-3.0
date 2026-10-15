import { useQuery } from "@tanstack/react-query";
import { fetchPublishedProducts } from "../productsApi";

export function usePublishedProducts({ page = 1, limit = 8 } = {}) {
  return useQuery({
    queryKey: ["products", "published", page, limit],
    queryFn: () => fetchPublishedProducts({ page, limit }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
