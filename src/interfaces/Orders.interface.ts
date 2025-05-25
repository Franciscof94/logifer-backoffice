export interface IOrder {
  product: string;
  client: string;
  count: number | undefined;
  address: string;
  discount: number;
  unitType: string;
  unit?: string;
  id?: string;
}

export interface IOrderWithClientId extends Omit<IOrder, "client"> {
  clientId: string | null;
}

export interface IOrderTable {
  product: {
    id: string;
    name: string;
  };
  discount: number;
  client: {
    label: string;
    value: string;
  };
  price: number;
  count: number | null;
  address: string;
  unit?: string;
  id?: string;
  unitType?: {
    id: string;
    label: string;
    equivalencyValue: number;
  };
}

export interface IOrderFilter {
  nameAndLastname: string;
  address: string;
  orderDate: string;
}

export interface IOrderModal {
  id: string;
  product: {
    id: string;
    name: string;
    unitType?: string;
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
  id: string;
  client: string;
  deliveryDate: string;
  orderDate: string;
  discount: number;
  total: number;
  send: boolean;
  address: string;
  order: Order[];
  createdBy?: string;
}

export interface Order {
  id: string;
  product: {
    id: string;
    name: string;
    unitType?: string;
  };
  count: number;
  price: string;
}

export interface CreateOrderPayload {
  clientId: string;
  address: string;
  orderDate: string;
  total: number;
  products: {
    productId: string;
    count: number;
    unitTypeId: string;
  }[];
  discount: number;
  deliveryDate: string | null;
}
