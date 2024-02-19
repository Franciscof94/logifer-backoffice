import { createSlice } from "@reduxjs/toolkit";
interface NavbarState {
  isOpen: boolean;
}

const defaultState: NavbarState = {
  isOpen: false,
};

const initialState = defaultState;

export const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setShowNavbar: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setShowNavbar } = navbarSlice.actions;

export default navbarSlice.reducer;
