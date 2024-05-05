import { createSlice } from "@reduxjs/toolkit";

interface authData {
    isLoggedIn: boolean;
    userData: Array<object> | null;
}

const initialState: authData = {
    isLoggedIn: false,
    userData: []
}

const profileSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        signIn(state, action) {
            state.isLoggedIn = true
            state.userData = action.payload
        },
        signOut(state) {
            state = initialState
        }
    },
})

export const { signIn, signOut } = profileSlice.actions;
export default profileSlice.reducer;