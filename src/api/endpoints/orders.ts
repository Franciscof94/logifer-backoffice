import { axiosInstance } from "../../axios/axios";
import {
  IOrderResponse,
  Data,
  CreateOrderPayload,
} from "../../interfaces/Orders.interface";
import { IOrderFilter } from "../../interfaces";

export const ordersEndpoints = {
  getOrders: async ({
    page = 0,
    size = 9,
    filters = { nameAndLastname: "", address: "", orderDate: "" },
  }: {
    page?: number;
    size?: number;
    filters?: IOrderFilter;
  }): Promise<IOrderResponse> => {
    let url = `/orders?page=${page}&size=${size}`;

    if (filters.nameAndLastname) {
      url += `&nameAndLastname=${encodeURIComponent(
        filters.nameAndLastname
      )}`;
    }
    if (filters.address) {
      url += `&address=${encodeURIComponent(filters.address)}`;
    }
    if (filters.orderDate) {
      url += `&orderDate=${encodeURIComponent(filters.orderDate)}`;
    }

    const response = await axiosInstance.get(url);

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  },

  getOrdersByClient: async (clientId: string): Promise<Data[]> => {
    const { data } = await axiosInstance.get(`/orders/client/${clientId}`);
    return data;
  },

  createOrder: async (orderData: CreateOrderPayload): Promise<void> => {
    const { data } = await axiosInstance.post("/orders", orderData);
    return data;
  },

  updateOrderStatus: async (orderId: string): Promise<void> => {
    const { data } = await axiosInstance.patch(`/orders/${orderId}/status`);
    return data;
  },

  updateOrderPaymentStatus: async (orderId: string, isPaid: boolean, paymentDate?: string): Promise<void> => {
    const payload = { isPaid, paymentDate };
    const { data } = await axiosInstance.patch(`/orders/${orderId}/payment-status`, payload);
    return data;
  },
};
