import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import ProductsService from '../../services/products/productsService';
import { IProduct } from '../../interfaces';

interface ProductsResponse {
  data: IProduct[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const useProducts = (page: number, size: number = 9) => {
  const filters = useSelector((state: RootState) => state.filtersData.filtersProducts);
  
  return useQuery<ProductsResponse>({
    queryKey: ['products', page, size, filters],
    queryFn: async () => {
      try {
        const filteredFilters = Object.keys(filters).reduce<Record<string, string>>(
          (acc, key) => {
            const value = filters[key as keyof typeof filters];
            if (value !== undefined && value !== "") {
              acc[key] = String(value);
            }
            return acc;
          },
          {}
        );
        
        const response = await ProductsService.getProducts({
          page,
          size,
          filters: filteredFilters,
        });
        
        return response;
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error al cargar los productos');
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!page && !!size,
    staleTime: 1000 * 60 * 1 // Data is fresh for 1 minute
  });
}; 