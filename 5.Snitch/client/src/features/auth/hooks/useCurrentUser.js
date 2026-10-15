import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchCurrentUser } from "../authApi";

export function useCurrentUser() {
  const { user, accessToken } = useSelector((state) => state.auth);

  const query = useQuery({
    queryKey: ["current-user", user?.id],
    queryFn: () => fetchCurrentUser(accessToken),
    enabled: Boolean(accessToken),
    initialData: user,
  });

  return { user: query.data, isLoading: query.isLoading, error: query.error };
}
