import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../productsApi";

export function useProductDetails(id) {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
