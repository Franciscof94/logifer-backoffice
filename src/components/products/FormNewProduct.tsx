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
  isMobile?: boolean;
}

export const FormNewProduct: FC<Props> = ({ methods, isMobile = false }) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className={`${isMobile ? 'w-full px-4' : 'w-[813px]'}`}>
      <div className="flex flex-col">
        <label className={`${isMobile ? 'text-lg' : 'text-xl'} mb-1`}>Nombre del producto</label>
        <InputText
          placeholder="Nombre del producto"
          type="text"
          width={isMobile ? "w-full" : "w-[813px]"}
          name="productName"
        />
      </div>
      <div className={`${isMobile ? 'flex flex-col gap-y-6' : 'flex gap-x-16'} mt-8`}>
        <div className={`flex flex-col ${isMobile ? 'w-full' : 'flex-1'}`}>
          <label className={`${isMobile ? 'text-lg' : 'text-xl'} mb-1`}>Precio</label>
          <InputText
            placeholder="Precio"
            type="number"
            name="price"
            step="0.01"
            className="w-full"
          />
        </div>
        <div className={`flex flex-col ${isMobile ? 'w-full' : 'flex-1'}`}>
          <label className={`${isMobile ? 'text-lg' : 'text-xl'} mb-1`}>Stock</label>
          <InputText 
            placeholder="Stock" 
            type="text" 
            name="stock" 
            className="w-full"
          />
        </div>
      </div>
      <div className={`flex ${isMobile ? 'justify-center mt-6' : 'justify-end mt-10'}`}>
        <Button
          color={isValid ? "blue" : "grey-50"}
          height="36px"
          legend="Guardar"
          size={isMobile ? "lg" : "xl"}
          isLoading={isLoadingButton}
          disabled={isLoadingButton || !isValid}
          weight="normal"
          width={isMobile ? "100%" : "140px"}
        />
      </div>
      <ToastContainer />
    </form>
  );
};