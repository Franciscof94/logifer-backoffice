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
  
  // Función para marcar productos específicos como enviados
  markProductsAsSent: async (data: {
    orderId: string;
    productIds?: string[];
    deliveryDate: string;
  }) => {
    console.log('[OrdersService] markProductsAsSent called with data:', JSON.stringify(data, null, 2));

    if (!data.orderId) {
      throw new Error("orderId es requerido");
    }

    const payload: any = {
      orderId: data.orderId, // Usar snake_case
      deliveryDate: data.deliveryDate, // Asumimos que el backend acepta camelCase para fechas o no es un ID
    };

    // Si se proporcionan productIds y no está vacío, los agregamos al payload
    // El frontend (PartialShipmentDrawer) ahora siempre envía productIds no vacíos.
    if (data.productIds && data.productIds.length > 0) {
      payload.product_ids = data.productIds; // Usar snake_case
    } else {
      // Si productIds no se proporciona o está vacío, el backend debería interpretar
      // la ausencia de 'product_ids' en el payload como "marcar todos los productos de la orden".
      // No es necesario hacer nada más aquí, ya que payload.product_ids no se establecerá.
      console.log('[OrdersService] No productIds provided or empty, backend will mark all products for the order.');
    }

    console.log('[OrdersService] Sending payload to /orders/mark-products-as-sent:', JSON.stringify(payload, null, 2));

    await axiosInstance.post("/orders/mark-products-as-sent", payload);
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
    operation?: 'increment' | 'decrement';
    amount?: number;
  }) => {
    let count = order.count;
    
    if (typeof count === 'number') {
      count = Math.round(count * 100) / 100;
    }
    
    // Preparamos el payload con la información de la operación
    const payload: any = {
      order_id: order.orderId,
      product_id: order.productId,
      count: count,
    };
    
    // Si se proporciona la operación y la cantidad, los incluimos en el payload
    if (order.operation) {
      payload.operation = order.operation;
    }
    
    if (order.amount) {
      payload.amount = Math.round(order.amount * 100) / 100;
    }
    
    console.log('Enviando actualización de cantidad al servidor:', payload);
    
    await axiosInstance.put(`/orders/edit-product-count`, payload);
  },

  deleteOrder: async (orderId: string | undefined) => {
    if (!orderId) {
      throw new Error("orderId es requerido");
    }
    
    await axiosInstance.delete(`/orders/${orderId}`);
  },
};

export default OrdersService;
