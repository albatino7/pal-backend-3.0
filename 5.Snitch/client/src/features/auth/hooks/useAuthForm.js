import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearAuthError,
  loginUser,
  registerUser,
} from "../authSlice";

export function useAuthForm(mode) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const isRegister = mode === "register";
  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, mode]);

  const onSubmit = form.handleSubmit(async (values) => {
    const action = isRegister
      ? registerUser(values)
      : loginUser({ email: values.email, password: values.password });

    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/home", { replace: true });
    }
  });

  return {
    ...form,
    onSubmit,
    isRegister,
    isSubmitting: status === "loading",
    serverError: error,
  };
}
