export interface IProduct {
  productName: string;
  price: number;
  stock: number;
  id?: number;
}

export interface IProductsFilter {
  product: string;
  unit?: string;
  price: string;
}

export interface IProductResponse {
  data: IProduct[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export enum UnitEnum {
  "mt" = "metros",
  "u" = "unidades",
  "plt" = "pallets",
}

export interface IProductsOptions {
  value: number;
  label: string;
  stock?: number;
  price?: number;
}

export interface IUnitTypeOptions {
  value: number;
  label: string;
  equivalencyValue?: number;
  isSelectCountDisabled?: boolean;
}
