import { FC, useState } from "react";
import { Data } from "../../interfaces";
import OrdersService from "../../services/orders/ordersService";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Data | undefined;
}

export const DeleteOrderDrawer: FC<Props> = ({ isOpen, onClose, order }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteOrder = async () => {
    if (!order?.id) return;
    
    try {
      setIsDeleting(true);
      await OrdersService.deleteOrder(order.id);
      
      // Invalidar y refrescar la consulta de órdenes
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.refetchQueries({ queryKey: ["orders"] });
      
      toast.success("Pedido eliminado correctamente");
      onClose();
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
      toast.error("Error al eliminar el pedido");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[85vh] sm:h-[70vh] p-6 rounded-t-xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left text-lg font-medium text-red-600">
            Eliminar pedido
          </SheetTitle>
        </SheetHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <p className="text-lg font-medium mb-2">¿Estás seguro que deseas eliminar este pedido?</p>
            <p className="text-gray-600">
              Esta acción no se puede deshacer. Se eliminará permanentemente el pedido 
              {order?.id && <span className="font-medium"> #{order.id}</span>} 
              {order?.client && <span> del cliente <span className="font-medium">{order.client}</span></span>}.
            </p>
          </div>

          {order?.order && order.order.length > 0 && (
            <div className="mb-6">
              <p className="font-medium mb-2">Productos en este pedido:</p>
              <ul className="list-disc pl-5 text-gray-600">
                {order.order.map((item, index) => (
                  <li key={index}>
                    {item.product?.name} - {item.count} unidades
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <SheetFooter className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteOrder}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar pedido"}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
