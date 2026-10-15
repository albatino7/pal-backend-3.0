import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  selectedSize: "ALL",
  sortBy: "newest",
  page: 1,
  limit: 8,
  isFormModalOpen: false,
  editingProduct: null,
  deletingProduct: null,
  quickViewProduct: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setSelectedSize(state, action) {
      state.selectedSize = action.payload;
      state.page = 1;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
      state.page = 1;
    },
    resetFilters(state) {
      state.searchQuery = "";
      state.selectedSize = "ALL";
      state.sortBy = "newest";
      state.page = 1;
    },
    openCreateModal(state) {
      state.editingProduct = null;
      state.isFormModalOpen = true;
    },
    openEditModal(state, action) {
      state.editingProduct = action.payload;
      state.isFormModalOpen = true;
    },
    closeFormModal(state) {
      state.isFormModalOpen = false;
      state.editingProduct = null;
    },
    openDeleteModal(state, action) {
      state.deletingProduct = action.payload;
    },
    closeDeleteModal(state) {
      state.deletingProduct = null;
    },
    openQuickView(state, action) {
      state.quickViewProduct = action.payload;
    },
    closeQuickView(state) {
      state.quickViewProduct = null;
    },
  },
});

export const {
  setSearchQuery,
  setSelectedSize,
  setSortBy,
  setPage,
  setLimit,
  resetFilters,
  openCreateModal,
  openEditModal,
  closeFormModal,
  openDeleteModal,
  closeDeleteModal,
  openQuickView,
  closeQuickView,
} = productsSlice.actions;

export default productsSlice.reducer;
