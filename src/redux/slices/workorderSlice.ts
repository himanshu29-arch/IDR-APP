import { createSlice } from "@reduxjs/toolkit";

interface workOrderData {
  workOrderData: [];
}

const initialState: workOrderData = {
  workOrderData: [],
};

const WorkOrderSlice = createSlice({
  name: "workOrderSlice",
  initialState,
  reducers: {
    workorderByClientID(state, action) {
      state = action.payload;
    },
  },
});

export const { signIn, signOut } = WorkOrderSlice.actions;
export default WorkOrderSlice.reducer;
