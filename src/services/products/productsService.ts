import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axios/axios";
import { IProduct, IProductResponse, IProductsFilter } from "../../interfaces";

const ProductsService = {
  postNewProduct: async (product: IProduct) => {
    await axiosInstance.post("/products/new-product", product);
  },
  getProducts: async ({ page, size = 9, filters }: any) => {
    const filterOptions = {
      ...filters,
      page,
      size,
    };

    let query = `?page=${filterOptions.page}&size=${filterOptions.size}`;
    for (const key in filterOptions) {
      if (key !== "page" && key !== "size") {
        query += `&${key}=${filterOptions[key as keyof IProductsFilter]}`;
      }
    }
    const response: AxiosResponse<IProductResponse> = await axiosInstance.get(
      "/products" + query
    );
    return response.data;
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
