import { FC, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { IProduct } from "../../interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductSchema } from "../../validationSchemas";
import ProductsService from "../../services/products/productsService";
import { toast } from "react-toastify";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { FormEditProduct } from "./FormEditProduct";
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
  product: IProduct | undefined;
  refreshTable: () => void;
}

export const EditProductDrawer: FC<Props> = ({
  isOpen,
  onClose,
  product,
  refreshTable,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const dispatch = useDispatch();
  const methods = useForm<IProduct>({
    resolver: yupResolver(ProductSchema),
  });

  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);

  const {
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && product) {
      setValue("productName", product?.productName ?? "");
      setValue("price", product?.price ?? 0);
      setValue("stock", product?.stock ?? 0);
    }
  }, [setValue, product, isOpen]);

  const onSubmit: SubmitHandler<IProduct> = async (data) => {
    try {
      dispatch(setLoadingButton(true));
      await ProductsService.patchProduct(product?.id, data);
      dispatch(setLoadingButton(false));
      toast.success("Producto editado exitosamente!");
      refreshTable();
      onClose();
    } catch (error: unknown) {
      dispatch(setLoadingButton(false));
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al editar el producto");
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
                  Producto:{" "}
                  <span className="font-normal">{product?.productName}</span>
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

            <div className="flex-1 overflow-auto p-0 bg-gray-50">
              <div className="p-6">
                <FormEditProduct methods={methods} />
              </div>
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
