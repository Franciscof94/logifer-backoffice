import { FC } from "react";
import { InputText } from "../customs/InputText";
import { Button } from "../customs/Button";
import { SubmitHandler } from "react-hook-form";
import { IClient } from "../../interfaces";
import ClientsService from "../../services/clients/clientsServices";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  methods: any;
}

export const FormNewClient: FC<Props> = ({ methods }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { isLoadingButton } = useSelector((state: any) => state.uiData);

  const onSubmit: SubmitHandler<IClient> = async (data) => {
    try {
      dispatch(setLoadingButton(true));
      await ClientsService.postNewClient(data);
      toast.success("Cliente creado exitosamente!");
      dispatch(setLoadingButton(false));
      setTimeout(() => {
        navigate("/clientes");
      }, 1000);
    } catch (error: any) {
      dispatch(setLoadingButton(false));
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex gap-x-16">
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Nombre y apellido</label>
          <InputText
            placeholder="Nombre y apellido"
            type="text"
            name="nameAndLastname"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Email</label>
          <InputText placeholder="Email" type="text" name="email" />
        </div>
      </div>
      <div className="flex gap-x-16 mt-8">
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Dirección</label>
          <InputText placeholder="Dirección" type="text" name="address" />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Teléfono <span className="text-sm text-[#757575]">(Ingresar número sin 0 y sin 15)</span></label>
          <InputText placeholder="Teléfono" type="text" name="phone" />
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
