import { FC, useEffect } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";
import { FormEditClient } from "./FormEditClient";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { IClient } from "../../interfaces/Clients.interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientSchema } from "../../validationSchemas";
import ClientsService from "../../services/clients/clientsServices";
import { toast } from "react-toastify";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  client: IClient | undefined;
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

export const EditClientModal: FC<Props> = ({
  modalIsOpen,
  closeModal,
  client,
  refreshTable,
}) => {
  const dispatch = useDispatch();
  const methods = useForm<IClient>({
    resolver: yupResolver(ClientSchema),
  });

  const { isLoadingButton } = useSelector((state: any) => state.uiData);

  const {
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    setValue("nameAndLastname", client?.nameAndLastname ?? "");
    setValue("email", client?.email ?? "");
    setValue("address", client?.address ?? "");
    setValue("phone", client?.phone ?? "");
  }, [setValue, client, modalIsOpen]);

  const onSubmit: SubmitHandler<IClient> = async (data) => {
    try {
      dispatch(setLoadingButton(true));
      await ClientsService.patchClient(client?.id, data);
      dispatch(setLoadingButton(false));
      toast.success("Cliente editado exitosamente!");
      refreshTable();
      closeModal();
    } catch (error: Error | AxiosError | any) {
      dispatch(setLoadingButton(false));
      toast.error(error.message);
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
                  Cliente: <small>{client?.nameAndLastname}</small>
                </p>
                <button onClick={closeModal}>
                  <FaTimes size={28} color="#B8B8B8" />
                </button>
              </div>

              <hr className=" border-grey" />
            </div>

            <FormEditClient
              methods={methods}
              client={client}
              refreshTable={refreshTable}
              modalIsOpen={modalIsOpen}
            />

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
                  isLoading={isLoadingButton}
                  disabled={isLoadingButton || !isValid}
                  width="130px"
                  type="submit"
                  color={isValid ? "blue" : "grey-50"}
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
