export interface IOrder {
  product: number | null;
  client: number | null;
  count: number | null;
  address: string;
  discount: boolean;
  unitType: number;
  unit?: string;
  id?: number;
}
export interface IOrderWithClientId extends Omit<IOrder, "client"> {
  clientId: number | null;
}

export interface IOrderTable {
  product: {
    id: number;
    name: string | undefined;
  };
  discount: boolean;
  client: {
    label: string;
    value: number | undefined;
  };
  price: number;
  count: number | null;
  address: string;
  unit?: string;
  id?: number;
}

export interface IOrderFilter {
  nameAndLastname: string;
  address: string;
  orderDate: string;
}

export interface IOrderModal {
  id: number;
  product: {
    id: number;
    name: string;
  };
  count: number;
  price: string;
  unit?: string;
}

export interface IOrderResponse {
  data: Data[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Data {
  id: number;
  client: string;
  deliveryDate: string;
  orderDate: string;
  discount: string;
  total: number;
  send: boolean;
  address: string;
  order: Order[];
}

export interface Order {
  id: number;
  product: {
    id: number;
    name: string;
  };
  count: number;
  price: string;
}
