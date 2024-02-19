import { AxiosResponse } from "axios";
import { axiosInstance } from "../../axios/axios";
import { IClient, IClientResponse, IClientsFilter } from "../../interfaces";

const ClientsService = {
  postNewClient: async (client: IClient) => {
    await axiosInstance.post("/clients/new-client", client);
  },
  patchClient: async (clientId: number | undefined, client: IClient) => {
    await axiosInstance.patch(`/clients/edit-client/${clientId}`, client);
  },
  deleteClient: async (clientId: number | undefined) => {
    await axiosInstance.delete(`/clients/delete-client/${clientId}`);
  },
  getClients: async ({ page, size = 9, filters }: any) => {
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
    const response: AxiosResponse<IClientResponse> = await axiosInstance.get(
      "/clients" + query
    );
    return response.data;
  },
};

export { ClientsService as default };
