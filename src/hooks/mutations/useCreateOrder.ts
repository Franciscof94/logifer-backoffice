import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersEndpoints } from '../../api/endpoints/orders';
import { toast } from 'react-toastify';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersEndpoints.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Pedido creado correctamente!');
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Ocurrió un error al procesar la solicitud');
      }
    }
  });
}; 