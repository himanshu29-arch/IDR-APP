import { combineReducers } from "@reduxjs/toolkit"; 
import authSlice from "./slices/authSlice";
import { rtkClient } from "../services/RTKClient";


export const rootReducer = combineReducers({
   auth: authSlice,
   [rtkClient.reducerPath]: rtkClient.reducer,
})