export interface ISelectOptions {
  value: string;
  label: string;
  address?: string;
}

export interface IProductOption {
  value: string;
  label: string;
  productName?: string;
  id?: string;
  price: number;
  stock: number;
  unitType: string;
}

export interface IClientOption {
  value: string;
  label: string;
  address: string;
}

export interface IUnitTypeOption {
  value: string;
  label: string;
  equivalencyValue: number;
  isSelectCountDisabled?: boolean;
}

interface RawUnitTypeOption {
  id: number;
  unitTypeDescription: string;
  equivalencyValue: string;
  isSelectCountDisabled: boolean;
}

interface RawClientOption {
  id: string;
  nameAndLastname: string;
  address: string;
  email: string;
  phone: string;
}

interface RawPaginatedClientsResponse {
  data: RawClientOption[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginatedClientsResponse {
  data: IClientOption[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ClientsApiResponse {
  data: RawPaginatedClientsResponse;
  statusCode: number;
  message: string;
}

export interface UnitTypesApiResponse {
  data: RawUnitTypeOption[];
  statusCode: number;
  message: string;
}

export interface PaginatedProductsResponse {
  items: IProductOption[];
  meta: {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}
