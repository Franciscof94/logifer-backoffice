import { FC, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { IProduct } from "../../interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductSchema } from "../../validationSchemas";
import { FormEditProduct } from "./FormEditProduct";
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
import { useUpdateProduct } from "@/hooks/mutations/useUpdateProduct";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct | undefined;
}

export const EditProductDrawer: FC<Props> = ({ isOpen, onClose, product }) => {
  const isMobile = useIsMobile(768);
  const methods = useForm<IProduct>({
    resolver: yupResolver(ProductSchema),
  });

  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const {
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    if (isOpen && product) {
      setValue("productName", product?.productName ?? "");
      setValue("price", product?.price ?? 0);
      setValue("stock", product?.stock ?? 0);
    }
  }, [setValue, product, isOpen]);

  const onSubmit: SubmitHandler<IProduct> = (data) => {
    if (!product?.id) return;

    updateProduct(
      {
        id: product.id, // Convertimos explícitamente a string
        data,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
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
                  disabled={isPending}
                  className={`rounded-full p-1 ${
                    isPending
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
                    isLoading={isPending}
                    disabled={isPending || !isValid}
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
                    disabled={isPending}
                    type="button"
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
                    disabled={isPending}
                    type="button"
                    onClick={onClose}
                  />
                  <Button
                    legend="Guardar"
                    size="xl"
                    height="36px"
                    isLoading={isPending}
                    disabled={isPending || !isValid}
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
