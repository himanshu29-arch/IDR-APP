import { createSlice } from "@reduxjs/toolkit";

interface commonDataInterface {
  AllClients: [];
}

const initialState: commonDataInterface = {
  AllClients: [],
};

const CommondDataSlice = createSlice({
  name: "CommondData",
  initialState,
  reducers: {
    getAllClients(state, action) {
      state.AllClients = action.payload;
    },
  },
});

export const { getAllClients } = CommondDataSlice.actions;
export default CommondDataSlice.reducer;
