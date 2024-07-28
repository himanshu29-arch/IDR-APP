import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import { rtkClient } from "../services/RTKClient";
import QRDataReducer from "./slices/QRDataSlice";
import CommonDataReducer from "./slices/CommonDataSlice";

export const rootReducer = combineReducers({
  auth: authSlice,
  QRData: QRDataReducer,
  CommonData: CommonDataReducer,

  [rtkClient.reducerPath]: rtkClient.reducer,
});
