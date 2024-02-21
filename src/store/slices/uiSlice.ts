import { createSlice } from "@reduxjs/toolkit";
interface UiState {
  isLoadingButton: boolean;
}

const defaultState: UiState = {
  isLoadingButton: false,
};

const initialState = defaultState;

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoadingButton: (state, action) => {
      state.isLoadingButton = action.payload;
    },
  },
});

export const { setLoadingButton } = uiSlice.actions;

export default uiSlice.reducer;
