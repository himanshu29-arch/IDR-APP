import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import { rtkClient } from "../services/RTKClient";
import QRDataReducer from "./slices/QRDataSlice";
import CommonDataReducer from "./slices/CommonDataSlice";
import EquipmentQRDataReducer from "./slices/EquipmentQRDataSlice";

export const rootReducer = combineReducers({
  auth: authSlice,
  QRData: QRDataReducer,
  EquipmentQRData: EquipmentQRDataReducer,
  CommonData: CommonDataReducer,

  [rtkClient.reducerPath]: rtkClient.reducer,
});
