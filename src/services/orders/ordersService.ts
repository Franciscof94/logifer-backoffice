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
    orderId: number | undefined;
    deliveryDate: string;
  }) => {
    await axiosInstance.post("/orders/mark-sent", order);
  },
  deleteProductOrder: async (
    orderId: number | undefined,
    productId: number | undefined
  ) => {
    await axiosInstance.delete(
      `/orders/delete-product-order/${orderId}/${productId}`
    );
  },

  editProductCount: async (order: {
    orderId: number | undefined;
    productId: number | undefined;
    count: number | undefined | null;
  }) => {
    await axiosInstance.patch(
      `/orders/edit-product-count/${order.orderId}/${order.productId}`,
      {
        count: order.count,
      }
    );
  },
};

export default OrdersService;
