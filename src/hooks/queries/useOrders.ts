import { useQuery } from '@tanstack/react-query';
import { ordersEndpoints } from '../../api/endpoints/orders';

export const useOrders = (page: number = 0, size: number = 9) => {
  return useQuery({
    queryKey: ['orders', page, size],
    queryFn: () => ordersEndpoints.getOrders({ page, size }),
  });
};

export const useOrdersByClient = (clientId: string) => {
  return useQuery({
    queryKey: ['ordersByClient', clientId],
    queryFn: () => ordersEndpoints.getOrdersByClient(clientId),
    enabled: !!clientId,
  });
}; 