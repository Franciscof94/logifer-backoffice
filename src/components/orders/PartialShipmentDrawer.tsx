import { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Checkbox } from "../ui/checkbox";
import OrdersService from "../../services/orders/ordersService";
import { Data } from "../../interfaces";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Data | undefined;
}

export const PartialShipmentDrawer: FC<Props> = ({
  isOpen,
  onClose,
  order,
}) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: boolean}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset selections when drawer opens with a new order
  useEffect(() => {
    if (isOpen && order) {
      // Initialize all products as selected by default
      const initialSelections: {[key: string]: boolean} = {};
      order.order.forEach(product => {
        // Only include products that haven't been shipped yet
        if (!product.shipped && !product.sent) {
          initialSelections[product.product.id] = true;
        }
      });
      setSelectedProducts(initialSelections);
      setSelectedDate(null);
    }
  }, [isOpen, order]);

  const handleDateSelect = (dateString: string) => {
    // Creamos la fecha usando el constructor Date con ISO string para evitar problemas de zona horaria
    const date = new Date(dateString + 'T12:00:00');
    setSelectedDate(date);
  };

  const handleCheckboxChange = (productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleConfirmShipment = async () => {
    if (!selectedDate) {
      toast.error('Selecciona una fecha de envío');
      return;
    }

    if (!order?.id) {
      toast.error('ID de pedido no disponible');
      return;
    }

    setIsSubmitting(true);

    try {
      // Obtener los IDs de los productos seleccionados para enviar
      const selectedProductIds = Object.entries(selectedProducts)
        .filter(([, isSelected]) => isSelected)
        .map(([productId]) => productId);
      
      // Verificar si hay productos seleccionados
      if (selectedProductIds.length === 0) {
        toast.error('Selecciona al menos un producto para enviar');
        setIsSubmitting(false);
        return;
      }
      
      // Siempre enviamos los IDs de los productos seleccionados para asegurar
      // que solo esos productos específicos sean marcados como enviados
      await OrdersService.markProductsAsSent({
        orderId: order.id,
        productIds: selectedProductIds,
        deliveryDate: format(selectedDate, 'yyyy-MM-dd')
      });
      
      toast.success('Productos marcados como enviados');
      
      // Actualizar datos
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.refetchQueries({ queryKey: ['orders'] });
      
      // Cerrar el drawer
      onClose();
    } catch (error) {
      console.error('Error al marcar productos como enviados:', error);
      toast.error('Error al marcar los productos como enviados');
    } finally {
      setIsSubmitting(false);
    }
  };

  const anyProductsToShip = order?.order.some(product => !product.shipped && !product.sent);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[85vh] sm:h-[70vh] p-4 sm:p-6 rounded-t-xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left text-xl font-medium">
            Marcar productos como enviados
          </SheetTitle>
        </SheetHeader>
        
        {/* Contenido principal con scroll */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100%-180px)] pb-4">
          {!anyProductsToShip ? (
            <div className="text-center py-8 text-gray-500">
              Todos los productos de este pedido ya han sido enviados.
            </div>
          ) : (
            <>
              {/* Sección de fecha */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Fecha de envío</h3>
                <input 
                  type="date" 
                  className="w-full p-3 border rounded-md text-base"
                  onChange={(e) => handleDateSelect(e.target.value)}
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                />
              </div>
              
              {/* Sección de productos */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Selecciona los productos enviados</h3>
                
                {/* Lista de productos con scroll interno si hay muchos */}
                <div className="border rounded-md p-3 max-h-[40vh] overflow-y-auto">
                  {order?.order.map((product) => {
                    // Determinar si el producto ya fue enviado
                    const isShipped = product.shipped || product.sent === true;
                    
                    return (
                      <div 
                        key={product.product.id} 
                        className={`flex items-start space-x-3 py-3 border-b last:border-b-0 ${isShipped ? 'opacity-70' : ''}`}
                      >
                        <Checkbox 
                          id={`product-${product.product.id}`}
                          checked={isShipped ? true : selectedProducts[product.product.id] || false}
                          onCheckedChange={() => !isShipped && handleCheckboxChange(product.product.id)}
                          disabled={isShipped}
                          className={`mt-0.5 ${isShipped ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                        <div className="grid gap-1.5 leading-none flex-1">
                          <div className="flex items-center">
                            <label 
                              htmlFor={isShipped ? undefined : `product-${product.product.id}`}
                              className={`text-sm font-medium ${isShipped ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              {product.product.name}
                            </label>
                            {isShipped && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Enviado
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Cantidad: {product.count} {product.product.unitType}
                          </div>
                          {isShipped && product.deliveryDate && (
                            <div className="text-xs text-gray-500">
                              Fecha de envío: {new Date(product.deliveryDate).toLocaleDateString('es-AR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Botones fijos en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 w-full">
            <button 
              className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              Cancelar
            </button>
            
            <button 
              className="w-full sm:w-auto px-5 py-3 bg-blue rounded-md text-white font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              onClick={handleConfirmShipment}
              disabled={!selectedDate || !anyProductsToShip || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar envío'}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
