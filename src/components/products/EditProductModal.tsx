import  { FC, useEffect } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";
import { FormEditProduct } from "./FormEditProduct";
import { IProduct } from "../../interfaces";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ProductSchema } from "../../validationSchemas/ProductSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import ProductsService from "../../services/products/productsService";
import { toast } from "react-toastify";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  product: IProduct | undefined;
  handleEdit: (id: number | undefined) => void;
  refreshTable: () => void;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: 775,
    padding: 0,
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export const EditProductModal: FC<Props> = ({
  modalIsOpen,
  closeModal,
  product,
  refreshTable,
}) => {
  const methods = useForm<IProduct>({
    resolver: yupResolver(ProductSchema),
  });
  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    setValue("price", product?.price ?? 0);
    setValue("product", product?.product ?? "");
    setValue("stock", product?.stock ?? 0);
  }, [setValue, product, modalIsOpen]);

  const onSubmit: SubmitHandler<IProduct> = async (data) => {
    try {
      await ProductsService.patchProduct(product?.id, data);
      toast.success("Producto editado exitosamente!");
      refreshTable();
      closeModal();
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <div className="">
              <div className="flex justify-between items-center px-3 py-3">
                <p className="text-2xl font-medium text-black">
                  Producto: <small>{product?.product}</small>
                </p>
                <button onClick={closeModal}>
                  <FaTimes size={28} color="#B8B8B8" />
                </button>
              </div>

              <hr className=" border-grey" />
            </div>

            <FormEditProduct />

            <div className="flex flex-col ">
              <div>
                <hr className=" border-grey" />
              </div>
              <div className="flex justify-end py-3 gap-x-2.5 mx-3">
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
                  height="36px"
                  width="130px"
                  color="blue"
                  weight="font-light"
                />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
