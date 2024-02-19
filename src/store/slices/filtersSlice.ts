import { createSlice } from "@reduxjs/toolkit";
import {
  IClientsFilter,
  IOrderFilter,
  IProductsFilter,
} from "../../interfaces";
interface FiltersState {
  filtersOrders: IOrderFilter;
  filtersClients: IClientsFilter;
  filtersProducts: IProductsFilter;
}

const defaultState: FiltersState = {
  filtersOrders: {
    address: "",
    nameAndLastname: "",
    orderDate: "",
  },
  filtersProducts: {
    price: "",
    product: "",
    unit: ""
  },
  filtersClients: {
    address: "",
    nameAndLastname: "",
    email: "",
  },
};

const initialState = defaultState;

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFiltersOrder: (state, action) => {
      state.filtersOrders = action.payload;
    },
    setFiltersClient: (state, action) => {
      state.filtersClients = action.payload;
    },

    setFiltersProducts: (state, action) => {
      state.filtersProducts = action.payload;
    },
  },
});

export const { setFiltersOrder, setFiltersClient, setFiltersProducts } =
  filtersSlice.actions;

export default filtersSlice.reducer;
