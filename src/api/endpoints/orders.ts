import { axiosInstance } from '../../axios/axios';
import { IOrderResponse, Data, CreateOrderPayload } from '../../interfaces/Orders.interface';



export const ordersEndpoints = {
  getOrders: async ({ page = 0, size = 9 }): Promise<IOrderResponse> => {
    const { data } = await axiosInstance.get(`/orders?page=${page}&size=${size}`);
    return data;
  },

  getOrdersByClient: async (clientId: string): Promise<Data[]> => {
    const { data } = await axiosInstance.get(`/orders/client/${clientId}`);
    return data;
  },

  createOrder: async (orderData: CreateOrderPayload): Promise<void> => {
    const { data } = await axiosInstance.post('/orders', orderData);
    return data;
  },

  updateOrderStatus: async (orderId: string): Promise<void> => {
    const { data } = await axiosInstance.patch(`/orders/${orderId}/status`);
    return data;
  }
};