import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ISelectOptions, IUnitTypeOptions } from "../../interfaces";
import { SelectOptionsService } from "../../services/SelectOptionsService";
interface SelectOptionsState {
  clientOptions: ISelectOptions[];
  productsOptions: ISelectOptions[];
  unitTypeOptions: IUnitTypeOptions[];
}

const defaultState: SelectOptionsState = {
  clientOptions: [],
  productsOptions: [],
  unitTypeOptions: [],
};

export const fetchClientsOptions = createAsyncThunk(
  "select/clients",
  async () => {
    const { data } = await SelectOptionsService.getClients();
    return data;
  }
);

export const fetchProductsOptions = createAsyncThunk(
  "select/products",
  async () => {
    const { data } = await SelectOptionsService.getProducts();
    return data;
  }
);

export const fetchUnitTypeOptions = createAsyncThunk(
  "select/unittype",
  async () => {
    const { data } = await SelectOptionsService.getUnitType();
    return data;
  }
);

const initialState = defaultState;

export const selectOptionsSlice = createSlice({
  name: "selectOptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchClientsOptions.fulfilled, (state, action) => {
      state.clientOptions = action.payload;
    });

    builder.addCase(fetchProductsOptions.fulfilled, (state, action) => {
      state.productsOptions = action.payload;
    });
    builder.addCase(fetchUnitTypeOptions.fulfilled, (state, action) => {
      state.unitTypeOptions = action.payload;
    });
  },
});

export const {} = selectOptionsSlice.actions;

export default selectOptionsSlice.reducer;
