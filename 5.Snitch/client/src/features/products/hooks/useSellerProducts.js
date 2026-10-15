import { useQuery } from "@tanstack/react-query";
import { fetchSellerProducts } from "../productsApi";

export function useSellerProducts() {
  return useQuery({
    queryKey: ["products", "seller"],
    queryFn: fetchSellerProducts,
    staleTime: 1000 * 30, // 30 seconds
  });
}
