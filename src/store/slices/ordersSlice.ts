import { createSlice } from "@reduxjs/toolkit";
interface OrdersState {
  clientName: {
    value: number | null;
    label: string;
  };
  addressAndClientNameDisabled: boolean;
  loadingTableOrders: boolean;
}

const defaultState: OrdersState = {
  clientName: {
    value: null,
    label: "",
  },
  addressAndClientNameDisabled: false,
  loadingTableOrders: false,
};

const initialState = defaultState;

export const ordersSlice = createSlice({
  name: "ordersSlice",
  initialState,
  reducers: {
    setClientName: (state, action) => {
      state.clientName = action.payload.clientName;
    },
    setAddresAndClientNameDisabled: (state, action) => {
      state.addressAndClientNameDisabled = action.payload;
    },
    setLoadingOrdersTable: (state, action) => {
      state.loadingTableOrders = action.payload;
    },
  },
});

export const {
  setClientName,
  setLoadingOrdersTable,
  setAddresAndClientNameDisabled,
} = ordersSlice.actions;

export default ordersSlice.reducer;
