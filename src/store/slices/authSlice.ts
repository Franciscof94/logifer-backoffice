import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  auth: any;
}

const defaultState: AuthState = {
  auth: {},
};

const initialState = defaultState;

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.auth = action.payload;
    },
    logout: (state) => {
      Cookies.remove("token");
      state.auth = {};
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
