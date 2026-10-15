import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productsReducer from "../features/products/productsSlice";
import { setAuthTokenProvider } from "../lib/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
});

setAuthTokenProvider(() => store.getState().auth.accessToken);

