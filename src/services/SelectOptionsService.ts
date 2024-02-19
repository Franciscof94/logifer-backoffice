import { axiosInstance } from "../axios/axios";

const SelectOptionsService = {
  getClients: async () => {
    return await axiosInstance.get("/clients/clients-options");
  },
  getProducts: async () => {
    return await axiosInstance.get("/products/products-options");
  },
  getUnitType: async () => {
    return await axiosInstance.get("/unittype");
  },
};

export { SelectOptionsService };
