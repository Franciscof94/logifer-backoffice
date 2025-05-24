import { axiosInstance } from '../../axios/axios';
import { PaginatedProductsResponse } from '../../interfaces/SelectOptions.interface';

export const productsEndpoints = {
  getProducts: async (): Promise<PaginatedProductsResponse> => {
    const response = await axiosInstance.get('/products');
    // La respuesta viene como { data: { items: [], meta: {} }, statusCode: 200, message: string }
    return response.data.data || { items: [], meta: { currentPage: 1, itemCount: 0, itemsPerPage: 10, totalItems: 0, totalPages: 1 } };
  }
}; 