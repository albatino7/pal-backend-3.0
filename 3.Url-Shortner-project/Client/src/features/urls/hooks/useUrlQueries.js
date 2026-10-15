import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import urlApi from "../api/urlApi";

export const urlKeys = {
  all: ["urls"],
  list: () => [...urlKeys.all, "list"],
  detail: (shortCode) => [...urlKeys.all, "detail", shortCode],
};

/**
 * Hook to fetch all URLs
 */
export const useUrlsQuery = (options = {}) => {
  return useQuery({
    queryKey: urlKeys.list(),
    queryFn: () => urlApi.getAllUrls(),
    ...options,
  });
};

/**
 * Hook to create a shortened URL
 */
export const useCreateUrlMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ url }) => urlApi.createShortUrl({ url }),
    onSuccess: (data, variables, context) => {
      // Invalidate URL list to trigger background refetch
      queryClient.invalidateQueries({ queryKey: urlKeys.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};

/**
 * Hook to delete a shortened URL
 */
export const useDeleteUrlMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shortCode) => urlApi.deleteUrl(shortCode),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: urlKeys.all });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};
