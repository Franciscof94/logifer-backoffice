import { FC } from "react";
import { IClient } from "../../interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Button } from "../customs/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { X } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  client: IClient | undefined;
  handleDelete: (id: number | undefined) => Promise<void>;
}

export const DeleteClientDrawer: FC<Props> = ({
  isOpen,
  onClose,
  client,
  handleDelete,
}) => {
  const isMobile = useIsMobile(768);
  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[60vh] sm:h-[50vh] p-0 rounded-t-xl [&>button]:hidden">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between w-full">
              <SheetTitle className="text-left text-lg font-medium">
                Eliminar cliente
              </SheetTitle>
              <button 
                type="button" 
                onClick={onClose}
                disabled={isLoadingButton}
                className={`rounded-full p-1 ${isLoadingButton ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>
            </div>
          </SheetHeader>
          
          <div className="flex-1 flex flex-col justify-center px-4 text-center">
            <p className={`${isMobile ? 'text-base' : 'text-lg'} font-light text-black mb-2`}>
              ¿Estás seguro de que deseas eliminar este cliente
              <span className="font-medium"> {client?.nameAndLastname}</span>?
            </p>
            <p className="text-red-500 font-medium my-3">
              Ten en cuenta que si borras este cliente se perderán todos los
              pedidos asociados al mismo.
            </p>
          </div>
          
          <SheetFooter className="px-4 py-3 border-t flex justify-end gap-x-2.5">
            {isMobile ? (
              <div className="w-full flex flex-col gap-y-2">
                <Button
                  legend="Eliminar"
                  size="xl"
                  height="40px"
                  disabled={isLoadingButton}
                  width="100%"
                  isLoading={isLoadingButton}
                  color="blue"
                  weight="medium"
                  onClick={async () => {
                    if (!isLoadingButton) {
                      await handleDelete(client?.id);
                    }
                  }}
                />
                <Button
                  legend="Cancelar"
                  size="xl"
                  height="40px"
                  width="100%"
                  color="grey-50"
                  weight="medium"
                  disabled={isLoadingButton}
                  onClick={onClose}
                />
              </div>
            ) : (
              <>
                <Button
                  legend="Cancelar"
                  size="xl"
                  height="36px"
                  width="130px"
                  color="grey-50"
                  weight="light"
                  disabled={isLoadingButton}
                  onClick={onClose}
                />
                <Button
                  legend="Eliminar"
                  size="xl"
                  height="36px"
                  disabled={isLoadingButton}
                  width="130px"
                  isLoading={isLoadingButton}
                  color="blue"
                  weight="light"
                  onClick={async () => {
                    if (!isLoadingButton) {
                      await handleDelete(client?.id);
                    }
                  }}
                />
              </>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
