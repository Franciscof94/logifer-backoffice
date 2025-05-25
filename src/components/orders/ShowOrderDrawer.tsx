import { FC } from "react";
import { IClientOrder } from "../../interfaces";
import { TableOrdersInModal } from "./TableOrdersInModal";
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
  clientOrder: IClientOrder | undefined;
  refreshTable: () => void;
}

export const ShowOrderDrawer: FC<Props> = ({
  isOpen,
  onClose,
  clientOrder,
  refreshTable,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[85vh] sm:h-[70vh] p-0 rounded-t-xl">
        <div className="flex flex-col h-full justify-between w-full">
          <SheetHeader className="px-4 py-3 border-b">
            <div className="flex items-center w-full">
              <SheetTitle className="text-left text-lg font-medium">
                Pedido de: <span className="font-normal">{clientOrder?.client}</span>
              </SheetTitle>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-auto p-4">
            <TableOrdersInModal
              orders={clientOrder?.order}
              clientOrder={clientOrder}
              refreshTable={refreshTable}
              closeModalOrderTable={onClose}
            />
          </div>
          
          <SheetFooter className="px-4 py-3 border-t flex justify-end">
            {/* Footer sin botón redundante */}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};