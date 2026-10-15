import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useCreateUrlMutation } from "./useUrlQueries";
import { setRecentlyCreated, clearRecentlyCreated } from "../slices/urlFilterSlice";
import useToast from "../../ui/hooks/useToast";

/**
 * Custom hook containing business logic for shortening URLs with React Hook Form
 */
export const useUrlShortener = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const recentlyCreated = useSelector((state) => state.urlFilters.recentlyCreated);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      url: "",
    },
    mode: "onTouched",
  });

  const createMutation = useCreateUrlMutation({
    onSuccess: (data) => {
      if (data) {
        dispatch(setRecentlyCreated(data));
        toast.success("Short link created successfully!");
        reset();
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate short link");
    },
  });

  const onSubmit = async (data) => {
    // Normalization: Ensure URL has http:// or https://
    let normalizedUrl = data.url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      await createMutation.mutateAsync({ url: normalizedUrl });
    } catch {
      // Error handled by onError callback in useCreateUrlMutation
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setValue("url", text.trim(), { shouldValidate: true, shouldDirty: true });
        setFocus("url");
        toast.info("Pasted from clipboard");
      }
    } catch {
      toast.info("Please paste using Ctrl+V or right-click");
    }
  };

  const clearRecent = () => {
    dispatch(clearRecentlyCreated());
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading: createMutation.isPending || isSubmitting,
    handlePaste,
    recentlyCreated,
    clearRecent,
    reset,
  };
};

export default useUrlShortener;
