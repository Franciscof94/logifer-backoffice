import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IClientOption, IProductOption, IUnitTypeOption } from "../../interfaces/SelectOptions.interface";
import { SelectOptionsService } from "../../services/SelectOptionsService";

interface SelectOptionsState {
  clientOptions: IClientOption[];
  productsOptions: IProductOption[];
  unitTypeOptions: IUnitTypeOption[];
}

const defaultState: SelectOptionsState = {
  clientOptions: [],
  productsOptions: [],
  unitTypeOptions: [],
};

export const fetchClientsOptions = createAsyncThunk<IClientOption[]>(
  "select/clients",
  async () => {
    const { data } = await SelectOptionsService.getClients();
    return data;
  }
);

export const fetchProductsOptions = createAsyncThunk<IProductOption[]>(
  "select/products",
  async () => {
    const { data } = await SelectOptionsService.getProducts();
    return data;
  }
);

export const fetchUnitTypeOptions = createAsyncThunk<IUnitTypeOption[]>(
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
