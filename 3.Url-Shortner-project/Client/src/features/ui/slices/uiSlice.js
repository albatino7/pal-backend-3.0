import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toasts: [],
  qrModal: {
    isOpen: false,
    shortCode: "",
    shortUrl: "",
    originalUrl: "",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast: (state, action) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
      state.toasts.push({
        id,
        message: action.payload.message,
        type: action.payload.type || "info", // "success" | "error" | "info"
        duration: action.payload.duration || 4000,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openQrModal: (state, action) => {
      state.qrModal = {
        isOpen: true,
        shortCode: action.payload.shortCode,
        shortUrl: action.payload.shortUrl,
        originalUrl: action.payload.originalUrl,
      };
    },
    closeQrModal: (state) => {
      state.qrModal = {
        isOpen: false,
        shortCode: "",
        shortUrl: "",
        originalUrl: "",
      };
    },
  },
});

export const { addToast, removeToast, openQrModal, closeQrModal } = uiSlice.actions;
export default uiSlice.reducer;
