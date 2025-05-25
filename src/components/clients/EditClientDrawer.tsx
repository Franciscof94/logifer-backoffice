import { FC, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { IClient } from "../../interfaces/Clients.interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientSchema } from "../../validationSchemas";
import ClientsService from "../../services/clients/clientsServices";
import { toast } from "react-toastify";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { FormEditClient } from "./FormEditClient";
import { Button } from "../customs/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { RootState } from "../../store/store";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  client: IClient | undefined;
  refreshTable: () => void;
}

export const EditClientDrawer: FC<Props> = ({
  isOpen,
  onClose,
  client,
  refreshTable,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const dispatch = useDispatch();
  const methods = useForm<IClient>({
    resolver: yupResolver(ClientSchema),
  });

  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);

  const {
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    if (isOpen && client) {
      setValue("nameAndLastname", client?.nameAndLastname ?? "");
      setValue("email", client?.email ?? "");
      setValue("address", client?.address ?? "");
      setValue("phone", client?.phone ?? "");
    }
  }, [setValue, client, isOpen]);

  const onSubmit: SubmitHandler<IClient> = async (data) => {
    try {
      dispatch(setLoadingButton(true));
      await ClientsService.putClient(client?.id, data);
      dispatch(setLoadingButton(false));
      toast.success("Cliente editado exitosamente!");
      refreshTable();
      onClose();
    } catch (error: unknown) {
      dispatch(setLoadingButton(false));
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al editar el cliente");
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[90vh] sm:h-[70vh] p-0 rounded-t-xl [&>button]:hidden"
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader className="px-4 py-3 border-b">
              <div className="flex items-center justify-between w-full">
                <SheetTitle className="text-left text-lg font-medium">
                  Cliente:{" "}
                  <span className="font-normal">{client?.nameAndLastname}</span>
                </SheetTitle>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoadingButton}
                  className={`rounded-full p-1 ${
                    isLoadingButton
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-auto p-4">
              <FormEditClient />
            </div>

            <SheetFooter className="px-4 py-3 border-t flex justify-end gap-x-2.5">
              {isMobile ? (
                <div className="w-full flex flex-col gap-y-2">
                  <Button
                    legend="Guardar"
                    size="xl"
                    height="40px"
                    isLoading={isLoadingButton}
                    disabled={isLoadingButton || !isValid}
                    width="100%"
                    type="submit"
                    color={isValid ? "blue" : "grey-50"}
                    weight="medium"
                  />
                  <Button
                    legend="Cancelar"
                    size="xl"
                    height="40px"
                    width="100%"
                    color="grey-50"
                    weight="medium"
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
                    onClick={onClose}
                  />
                  <Button
                    legend="Guardar"
                    size="xl"
                    height="36px"
                    isLoading={isLoadingButton}
                    disabled={isLoadingButton || !isValid}
                    width="130px"
                    type="submit"
                    color={isValid ? "blue" : "grey-50"}
                    weight="light"
                  />
                </>
              )}
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};
