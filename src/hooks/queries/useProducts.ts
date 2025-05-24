import { useQuery } from '@tanstack/react-query';
import { productsEndpoints } from '../../api/endpoints/products';
import { toast } from 'react-toastify';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const data = await productsEndpoints.getProducts();
        return data;
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error al cargar los productos');
        throw error;
      }
    },
    retry: 1
  });
}; 