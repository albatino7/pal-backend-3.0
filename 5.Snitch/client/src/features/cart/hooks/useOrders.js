import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllOrders,
  fetchMyOrders,
  updateOrderStatus,
} from "../ordersApi";

export function useMyOrders() {
  return useQuery({
    queryKey: ["orders", "my"],
    queryFn: fetchMyOrders,
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ["orders", "all"],
    queryFn: fetchAllOrders,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
