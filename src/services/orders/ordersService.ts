import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axios/axios";
import { IOrderFilter, IOrderResponse } from "../../interfaces";

const OrdersService = {
  postNewOrder: async (order: any) => {
    await axiosInstance.post("/orders/new-order", order, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
  getOrders: async ({ page, size = 10, filters }: any) => {
    const filterOptions = {
      ...filters,
      page,
      size,
    };

    let query = `?page=${filterOptions.page}&size=${filterOptions.size}`;
    for (const key in filterOptions) {
      if (key !== "page" && key !== "size") {
        query += `&${key}=${filterOptions[key as keyof IOrderFilter]}`;
      }
    }
    const response: AxiosResponse<IOrderResponse> = await axiosInstance.get(
      "/orders" + query
    );
    return response.data;
  },
  markAsSent: async (order: {
    orderId: string | undefined;
    deliveryDate: string;
  }) => {
    if (!order.orderId) {
      throw new Error("orderId es requerido");
    }

    await axiosInstance.post("/orders/mark-as-sent", {
      order_id: order.orderId,
      deliveryDate: order.deliveryDate,
    });
  },
  deleteProductOrder: async (
    orderId: string | undefined,
    productId: string | undefined
  ) => {
    await axiosInstance.delete(
      `/orders/delete-product-order/${orderId}/${productId}`
    );
  },

  editProductCount: async (order: {
    orderId: string | undefined;
    productId: string | undefined;
    count: number | undefined | null;
  }) => {
    let count = order.count;
    
    if (typeof count === 'number') {
      count = Math.round(count * 100) / 100;
    }
    
    console.log('Enviando actualización de cantidad al servidor:', {
      order_id: order.orderId,
      product_id: order.productId,
      count: count
    });
    
    await axiosInstance.put(`/orders/edit-product-count`, {
      order_id: order.orderId,
      product_id: order.productId,
      count: count,
    });
  },
};

export default OrdersService;
