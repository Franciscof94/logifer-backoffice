import { useQuery } from '@tanstack/react-query';
import { clientsEndpoints } from '../../api/endpoints/clients';
import { toast } from 'react-toastify';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const data = await clientsEndpoints.getClients();
        return data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Error al cargar los clientes');
        throw error;
      }
    },
    retry: 1
  });
}; 