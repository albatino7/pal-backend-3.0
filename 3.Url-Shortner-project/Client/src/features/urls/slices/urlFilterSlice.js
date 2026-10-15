import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  sortBy: "newest", // "newest" | "oldest" | "most-clicks" | "least-clicks"
  recentlyCreated: null,
};

const urlFilterSlice = createSlice({
  name: "urlFilters",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setRecentlyCreated: (state, action) => {
      state.recentlyCreated = action.payload;
    },
    clearRecentlyCreated: (state) => {
      state.recentlyCreated = null;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.sortBy = "newest";
    },
  },
});

export const {
  setSearchQuery,
  setSortBy,
  setRecentlyCreated,
  clearRecentlyCreated,
  resetFilters,
} = urlFilterSlice.actions;

export default urlFilterSlice.reducer;
