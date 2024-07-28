import { createSlice } from "@reduxjs/toolkit";

interface authData {
  isLoggedIn: boolean;
  userData: Array<object> | null;
  rememberMe: boolean;
}

const initialState: authData = {
  isLoggedIn: false,
  userData: [],
  rememberMe: false,
};

const profileSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    signIn(state, action) {
      state.isLoggedIn = true;
      state.userData = action.payload.payload;
      state.rememberMe = action.payload.rememberMe;
    },
    signOut(state) {
      state.isLoggedIn = false;
      state = initialState;
    },
  },
});

export const { signIn, signOut } = profileSlice.actions;
export default profileSlice.reducer;
