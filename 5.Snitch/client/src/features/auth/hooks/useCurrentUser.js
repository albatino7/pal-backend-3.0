import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchCurrentUser } from "../authApi";

export function useCurrentUser() {
  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const query = useQuery({
    queryKey: ["current-user", user?.id || user?._id],
    queryFn: () => fetchCurrentUser(accessToken),
    enabled: Boolean(accessToken),
    initialData: user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { user: query.data, isLoading: query.isLoading, error: query.error };
}
