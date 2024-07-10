import { createSlice } from "@reduxjs/toolkit";

interface workOrderData {
  model: String;
}

const initialState: workOrderData = {
  model: "",
};

const QRDataSlice = createSlice({
  name: "QRData",
  initialState,
  reducers: {
    setQRData(state, action) {
      state.model = action.payload;
    },
  },
});

export const { setQRData } = QRDataSlice.actions;
export default QRDataSlice.reducer;
