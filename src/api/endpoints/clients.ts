import { axiosInstance } from "../../axios/axios";
import { ClientsApiResponse, PaginatedClientsResponse } from "../../interfaces/SelectOptions.interface";

export const clientsEndpoints = {
  getClients: async (): Promise<PaginatedClientsResponse> => {
    const response = await axiosInstance.get<ClientsApiResponse>("/clients");
    
    return {
      ...response.data.data,
      data: (response.data.data.data || []).map(client => ({
        value: client.id || '',  // Aseguramos que siempre haya un valor
        label: client.nameAndLastname,
        address: client.address,
        email: client.email,
        phone: client.phone
      }))
    };
  },
};
