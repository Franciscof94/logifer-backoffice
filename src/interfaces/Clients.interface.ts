import { IOrderModal } from ".";

export interface IClient {
  nameAndLastname: string;
  phone: string;
  address: string;
  email: string;
  id?: number;
}

export interface IClientOrder {
  orderDate: string;
  client: string;
  total: number;
  discount: string;
  send: boolean;
  deliveryDate?: string;
  order: IOrderModal[];
}

export interface IClientResponse {
  data: IClient[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IClientsFilter {
  nameAndLastname: string;
  email: string;
  address: string;
}

export interface IClientsSelectOptions {
  value: number | string | undefined;
  label: string;
  address: string;
}
