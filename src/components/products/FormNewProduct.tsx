import { FC } from "react";
import { InputText } from "../customs/InputText";
import { Button } from "../customs/Button";
import { SubmitHandler } from "react-hook-form";
import { IProduct } from "../../interfaces";
import ProductsService from "../../services/products/productsService";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  methods: any;
}

export const FormNewProduct: FC<Props> = ({ methods }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoadingButton } = useSelector((state: any) => state.uiData);
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit: SubmitHandler<IProduct> = async (data) => {
    try {
      dispatch(setLoadingButton(true));
      await ProductsService.postNewProduct(data);
      dispatch(setLoadingButton(false));
      toast.success("Producto creado exitosamente");
      setTimeout(() => {
        navigate("/productos");
      }, 1000);
    } catch (error: any) {
      dispatch(setLoadingButton(false));
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label className="text-xl mb-1">Nombre del producto</label>
        <InputText
          placeholder="Nombre del producto"
          type="text"
          width="w-[813px]"
          name="product"
        />
      </div>
      <div className="flex gap-x-16 mt-8">
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Precio</label>
          <InputText
            placeholder="Precio"
            type="number"
            name="price"
            step="0.01"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Stock</label>
          <InputText placeholder="Stock" type="text" name="stock" />
        </div>
      </div>
      <div className="flex justify-end mt-10">
        <Button
          color={isValid ? "blue" : "grey-50"}
          height="36px"
          legend="Guardar"
          size="xl"
          isLoading={isLoadingButton}
          disabled={isLoadingButton || !isValid}
          weight="normal"
          width="140px"
        />
      </div>
      <ToastContainer />
    </form>
  );
};
