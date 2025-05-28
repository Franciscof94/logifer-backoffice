import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersEndpoints } from '../../api/endpoints/orders';
import { toast } from 'react-toastify';

export const useUpdateOrderPaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, isPaid, paymentDate }: { orderId: string; isPaid: boolean; paymentDate?: string }) => 
      ordersEndpoints.updateOrderPaymentStatus(orderId, isPaid, paymentDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Estado de pago actualizado correctamente!');
    },
    onError: () => {
      toast.error('Error al actualizar el estado de pago');
    }
  });
}; 