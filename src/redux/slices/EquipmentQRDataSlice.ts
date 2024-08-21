import { createSlice } from "@reduxjs/toolkit";

interface workOrderData {
  serial_number: String;
}

const initialState: workOrderData = {
  serial_number: "",
};

const EquipmentQRDataSlice = createSlice({
  name: "EquipmentQRData",
  initialState,
  reducers: {
    setEquipmentQRData(state, action) {
      state.serial_number = action.payload;
    },
  },
});

export const { setEquipmentQRData } = EquipmentQRDataSlice.actions;
export default EquipmentQRDataSlice.reducer;
