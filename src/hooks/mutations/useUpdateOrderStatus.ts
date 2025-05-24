import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersEndpoints } from '../../api/endpoints/orders';
import { toast } from 'react-toastify';

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersEndpoints.updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Estado del pedido actualizado correctamente!');
    },
    onError: () => {
      toast.error('Error al actualizar el estado del pedido');
    }
  });
}; 