import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axios/axios";
import { IProduct } from "../../interfaces";

interface ProductsApiResponse {
  data?: {
    items: IProduct[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
  statusCode: number;
  message: string;
}

const ProductsService = {
  postNewProduct: async (product: IProduct) => {
    await axiosInstance.post("/products/new-product", product);
  },
  getProducts: async ({ page, size = 9, filters }: { page: number; size?: number; filters?: Record<string, string> }) => {
    console.log('getProducts endpoint called with:', { page, size, filters });
    try {
      const filterOptions: Record<string, string | number> = {
        page,
        size,
      };
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            filterOptions[key] = filters[key];
          }
        });
      }

      let query = `?page=${filterOptions.page}&size=${filterOptions.size}`;
      for (const key in filterOptions) {
        if (key !== "page" && key !== "size" && filterOptions[key]) {
          query += `&${key}=${filterOptions[key]}`;
        }
      }
      
      console.log('Calling API with URL:', '/products' + query);
      const response: AxiosResponse<ProductsApiResponse> = await axiosInstance.get(
        "/products" + query
      );
      console.log('Raw API response:', response);
      
      if (response.data && response.data.data) {
        console.log('Detected nested data structure');
        return {
          data: response.data.data.items,
          page: response.data.data.meta.currentPage - 1,
          size: response.data.data.meta.itemsPerPage,
          totalElements: response.data.data.meta.totalItems,
          totalPages: response.data.data.meta.totalPages
        };
      }
      
      console.log('Using original data structure');
      return {
        data: [],
        page: 0,
        size: size,
        totalElements: 0,
        totalPages: 0
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        data: [],
        page: 0,
        size: size,
        totalElements: 0,
        totalPages: 0
      };
    }
  },
  deleteProduct: async (productId: number | undefined) => {
    await axiosInstance.delete(`/products/delete-product/${productId}`);
  },
  editProductStock: (
    productId: number | undefined,
    count: number | undefined | null
  ) => {
    const res = axiosInstance.patch(
      `/products/edit-product-stock/${productId}`,
      { count: count }
    );
    return res;
  },

  patchProduct: async (productId: number | undefined, product: IProduct) => {
    await axiosInstance.patch(
      `/products/edit-product/${productId}`,
      product
    );
  },
};

export { ProductsService as default };
