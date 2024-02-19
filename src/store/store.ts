import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import navbarSlice from "./slices/navbarSlice";
import ordersSlice from "./slices/ordersSlice";
import selectOptionsSlice from "./slices/selectOptionsSlice";
import filtersSlice from "./slices/filtersSlice";

export const store = configureStore({
  reducer: {
    authData: authSlice,
    navbarData: navbarSlice,
    ordersData: ordersSlice,
    selectOptionsData: selectOptionsSlice,
    filtersData: filtersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
