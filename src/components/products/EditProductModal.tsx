import { FC, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";
import { FormEditProduct } from "./FormEditProduct";
import { IProduct } from "../../interfaces";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ProductSchema } from "../../validationSchemas/ProductSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import ProductsService from "../../services/products/productsService";
import { toast } from "react-toastify";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { RootState } from "@/store/store";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  product: IProduct | undefined;
  handleEdit: (id: number | undefined) => void;
  refreshTable: () => void;
}

export const EditProductModal: FC<Props> = ({
  modalIsOpen,
  closeModal,
  product,
  refreshTable,
}) => {
  const dispatch = useDispatch();
  const methods = useForm<IProduct>({
    resolver: yupResolver(ProductSchema),
  });
  const {
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);

  useEffect(() => {
    setValue("price", product?.price ?? 0);
    setValue("productName", product?.productName ?? "");
    setValue("stock", product?.stock ?? 0);
  }, [setValue, product, modalIsOpen]);

  const onSubmit: SubmitHandler<IProduct> = async (data) => {
    try {
      dispatch(setLoadingButton(true));
      await ProductsService.patchProduct(product?.id, data);
      dispatch(setLoadingButton(false));
      toast.success("Producto editado exitosamente!");
      refreshTable();
      closeModal();
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
    <Dialog open={modalIsOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[775px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-medium text-black">
              Producto: <small>{product?.productName}</small>
            </DialogTitle>
            <button onClick={closeModal} className="h-6 w-6">
              <FaTimes className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormEditProduct methods={methods} />

            <DialogFooter className="sm:justify-end gap-x-2">
              <Button
                legend="Cancelar"
                size="xl"
                height="36px"
                width="130px"
                color="grey-50"
                weight="font-light"
                onClick={closeModal}
              />
              <Button
                legend="Guardar"
                size="xl"
                isLoading={isLoadingButton}
                disabled={isLoadingButton || !isValid}
                color={isValid ? "blue" : "grey-50"}
                height="36px"
                width="130px"
                weight="font-light"
              />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
