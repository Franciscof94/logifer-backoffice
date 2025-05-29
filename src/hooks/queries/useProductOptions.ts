import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../axios/axios';
import { toast } from 'react-toastify';

export const useProductOptions = () => {
  return useQuery({
    queryKey: ['productOptions'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/products/products-options');
        return {
          items: response.data.data || [],
          meta: {}
        };
      } catch (error) {
        console.error('Error fetching product options:', error);
        toast.error('Error al cargar las opciones de productos');
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};
