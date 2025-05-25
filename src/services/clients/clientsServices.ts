import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axios/axios";
import { IClientsFilter } from "../../interfaces";
import { IClient } from "../../interfaces";

const ClientsService = {
  postNewClient: async (client: IClient) => {
    await axiosInstance.post("/clients", client);
  },
  putClient: async (clientId: number | undefined, client: IClient) => {
    await axiosInstance.put(`/clients/edit`, {id: clientId, client});
  },
  deleteClient: async (clientId: number | undefined) => {
    await axiosInstance.delete(`/clients/${clientId}`);
  },
  getClients: async ({
    page,
    size = 9,
    filters,
  }: {
    page?: number;
    size?: number;
    filters?: IClientsFilter;
  }) => {
    console.log("getClients endpoint called with:", { page, size });
    try {
      const filterOptions = {
        ...filters,
        page,
        size,
      };

      let query = `?page=${filterOptions.page}&size=${filterOptions.size}`;
      for (const key in filterOptions) {
        if (key !== "page" && key !== "size") {
          query += `&${key}=${filterOptions[key as keyof IClientsFilter]}`;
        }
      }

      console.log("Calling API with URL:", "/clients" + query);
      const response: AxiosResponse<{
        data?: {
          data: IClient[];
          page: number;
          size: number;
          totalElements: number;
          totalPages: number;
        };
      }> = await axiosInstance.get("/clients" + query);
      console.log("Raw API response:", response);

      if (response.data && response.data.data) {
        console.log(
          "Detected nested data structure, returning inner data object"
        );
        return response.data.data;
      }

      console.log("Using original data structure");
      return response.data;
    } catch (error) {
      console.error("Error in getClients endpoint:", error);
      throw error;
    }
  },
};

export { ClientsService as default };
