import { FC, useState, useEffect } from "react";
import { Data } from "../../interfaces";
import { useUpdateOrderPaymentStatus } from "../../hooks/mutations/useUpdateOrderPaymentStatus";
// import { Button } from "../ui/button"; // Ya no usaremos este Button
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  // SheetFooter, // No se usa más
  // SheetClose, // No se usa más
} from "../ui/sheet";

interface PaymentStatusSheetProps {
  isOpen: boolean;
  onClose: () => void;
  order: Data | undefined;
  refreshTable: () => void;
}

export const PaymentStatusDrawer: FC<PaymentStatusSheetProps> = ({
  isOpen,
  onClose,
  order,
  refreshTable,
}) => {
  const [paymentDate, setPaymentDate] = useState<string>("");
  const mutation = useUpdateOrderPaymentStatus();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      setPaymentDate(order.paymentDate || "");
    } else if (!isOpen) {
      setPaymentDate("");
    }
  }, [isOpen, order]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDate(e.target.value);
  };

  const handleSave = async () => {
    if (!order) return;

    setIsLoading(true);
    try {
      await mutation.mutateAsync({
        orderId: order.id,
        isPaid: true,
        paymentDate: paymentDate || undefined,
      });
      refreshTable();
      onClose();
    } catch (error) {
      console.error("Error al guardar el estado de pago:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="sm:max-w-none h-[60vh] p-4 sm:p-6 flex flex-col"
      >
        <SheetHeader className="pb-4 flex-shrink-0">
          <SheetTitle className="text-left text-xl font-medium">
            Registrar pago del pedido
          </SheetTitle>
          {order && (
            <SheetDescription className="text-left">
              Cliente: {order.client} | Total: ${order.total}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="py-4 flex-grow overflow-y-auto">
          <label
            htmlFor="paymentDateInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fecha de pago
          </label>
          <input
            id="paymentDateInput"
            type="date"
            value={paymentDate}
            onChange={handleDateChange}
            className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="pt-4 bg-white border-t flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full">
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-3 bg-blue rounded-md text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
              onClick={handleSave}
              disabled={isLoading || !paymentDate}
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
