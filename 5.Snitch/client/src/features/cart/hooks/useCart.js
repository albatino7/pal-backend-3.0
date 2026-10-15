import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
  addToCart,
  clearCart,
  fetchCart,
  removeFromCart,
  updateCartQuantity,
} from "../cartApi";

export function useCart() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: (previousData) => previousData,
  });

  const cart = query.data;

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, [queryClient]);

  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: invalidate,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: updateCartQuantity,
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: invalidate,
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: invalidate,
  });

  // Calculate totals
  const { totalAmount, totalItems } = useMemo(() => {
    if (!cart?.products || cart.products.length === 0) {
      return { totalAmount: 0, totalItems: 0 };
    }

    let amount = 0;
    let items = 0;

    cart.products.forEach((item) => {
      const price = item.product?.price?.amount || 0;
      amount += price * item.quantity;
      items += item.quantity;
    });

    return { totalAmount: amount, totalItems: items };
  }, [cart]);

  return {
    cart,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    totalAmount,
    totalItems,
    addToCart: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateQuantity: updateQuantityMutation.mutateAsync,
    isUpdating: updateQuantityMutation.isPending,
    removeFromCart: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    clearCart: clearMutation.mutateAsync,
    isClearing: clearMutation.isPending,
  };
}
