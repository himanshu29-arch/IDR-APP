import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inventories: [],
  inventory: null,
  loading: false,
  loadingAssign: false,
  loadingTransfer: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    deleteInventoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteInventorySuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      // state.inventories = state.inventories.filter(inventory => inventory.id !== action.payload);
    },
    deleteInventoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  deleteInventoryStart,
  deleteInventorySuccess,
  deleteInventoryFailure,
} = inventorySlice.actions;

export default inventorySlice.reducer;
