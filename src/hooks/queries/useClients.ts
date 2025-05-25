import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import ClientsService from '../../services/clients/clientsServices';
import { IClient } from '../../interfaces';

interface ClientsResponse {
  data: IClient[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const useClients = (page: number, size: number = 9) => {
  const filters = useSelector((state: RootState) => state.filtersData.filtersClients);
  console.log("useClients hook called with:", { page, size, filters });
  
  return useQuery<ClientsResponse>({
    queryKey: ["clients", page, size, filters],
    queryFn: async () => {
      console.log("queryFn executing for page:", page, "with filters:", filters);
      try {
        console.log("Before API call");
        const response = await ClientsService.getClients({ page, size, filters });
        console.log("API Response Data:", response);
        
        if (response && typeof response === 'object') {
          if ('data' in response && response.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'data' in response.data) {
            const nestedData = response.data as any;
            return {
              data: nestedData.data || [],
              page: nestedData.page || 0,
              size: nestedData.size || size,
              totalElements: nestedData.totalElements || 0,
              totalPages: nestedData.totalPages || 0
            };
          } 
          
          if ('data' in response && Array.isArray(response.data)) {
            const flatData = response as any;
            return {
              data: flatData.data || [],
              page: flatData.page || 0,
              size: flatData.size || size,
              totalElements: flatData.totalElements || 0,
              totalPages: flatData.totalPages || 0
            };
          }
        }
        
        return {
          data: [],
          page: 0,
          size: size,
          totalElements: 0,
          totalPages: 0
        };
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Error al cargar los clientes");
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!page && !!size,
    gcTime: 0,
    staleTime: 0,
  });
};