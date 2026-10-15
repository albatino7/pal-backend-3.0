import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../authSlice";

export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return async function logout() {
    const result = await dispatch(logoutUser());
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login", { replace: true });
    }
  };
}
