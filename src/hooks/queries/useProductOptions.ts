import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../axios/axios';
import { IProductOption } from '../../interfaces/SelectOptions.interface';
import { toast } from 'react-toastify';

interface ProductOptionsResponse {
  data: IProductOption[];
  statusCode: number;
  message: string;
}

export const useProductOptions = () => {
  return useQuery({
    queryKey: ['productOptions'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<ProductOptionsResponse>('/products/products-options');
        return response.data.data || [];
      } catch (error) {
        console.error('Error fetching product options:', error);
        toast.error('Error al cargar las opciones de productos');
        throw error;
      }
    },
    retry: 1
  });
};
