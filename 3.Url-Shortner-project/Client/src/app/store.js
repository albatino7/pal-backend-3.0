import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/slices/uiSlice";
import urlFiltersReducer from "../features/urls/slices/urlFilterSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    urlFilters: urlFiltersReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
