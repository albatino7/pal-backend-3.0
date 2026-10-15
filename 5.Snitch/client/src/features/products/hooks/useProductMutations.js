import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  listProduct,
  unlistProduct,
} from "../productsApi";

export function useProductMutations() {
  const queryClient = useQueryClient();

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: invalidateProducts,
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: invalidateProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: invalidateProducts,
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isCurrentlyPublished }) => {
      if (isCurrentlyPublished) {
        return await unlistProduct(id);
      } else {
        return await listProduct(id);
      }
    },
    onSuccess: invalidateProducts,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    togglePublishMutation,
  };
}
