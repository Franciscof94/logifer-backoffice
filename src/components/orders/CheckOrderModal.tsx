import { ChangeEvent, FC, useState } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Data } from "../../interfaces";
import OrdersService from "../../services/orders/ordersService";
import { InputText } from "../customs/InputText";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  refreshTable: () => void;
  order: Data | undefined;
}

export const CheckOrderModal: FC<Props> = ({
  modalIsOpen,
  closeModal,
  refreshTable,
  order,
}) => {
  const dispatch = useDispatch();
  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);
  const [deliveryDate, setDeliveryDate] = useState("");
  const isMobile = useIsMobile(768);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: isMobile ? "5%" : "auto",
      bottom: "auto",
      marginRight: "-50%",
      width: isMobile ? "90%" : 530,
      height: isMobile ? "auto" : 280,
      maxHeight: isMobile ? "90vh" : "auto",
      padding: 0,
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="">
          <div className={`flex justify-between items-center ${isMobile ? 'px-2 py-2' : 'px-3 py-3'}`}>
            <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-medium text-black`}>Actualizar pedido</p>
            <button onClick={closeModal}>
              <FaTimes size={isMobile ? 24 : 28} color="#B8B8B8" />
            </button>
          </div>

          <hr className=" border-grey" />
        </div>

        <div className={`${isMobile ? 'my-3' : 'my-4'} text-center`}>
          <p className={`${isMobile ? 'text-base' : 'font-lg font-xl'} text-black`}>
            ¿Estás seguro de que deseas marcar este pedido como enviado?
          </p>
          <div className={`${isMobile ? 'px-4' : 'px-12'}`}>
            <p className="font-medium text-black text-base my-3 text-start">
              Fecha de envio
            </p>
            <InputText
              color="bg-grey"
              type="date"
              name="date"
              placeholder="Fecha del envio"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDeliveryDate(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="">
          <hr className=" border-grey" />
          <div className={`flex justify-end gap-x-2.5 ${isMobile ? 'px-2 my-2' : 'px-3 my-3'}`}>
            <Button
              legend="Cancelar"
              size={isMobile ? "lg" : "xl"}
              height={isMobile ? "32px" : "36px"}
              width={isMobile ? "100px" : "130px"}
              color="grey-50"
              weight="font-light"
              onClick={() => {
                closeModal();
                setDeliveryDate("");
              }}
            />
            <Button
              legend="Aceptar"
              size={isMobile ? "lg" : "xl"}
              height={isMobile ? "32px" : "36px"}
              isLoading={isLoadingButton}
              disabled={isLoadingButton || !deliveryDate}
              width={isMobile ? "100px" : "130px"}
              color={!deliveryDate ? "grey-50" : "blue"}
              weight="font-light"
              onClick={async () => {
                try {
                  dispatch(setLoadingButton(true));
                  await OrdersService.markAsSent({
                    orderId: order?.id,
                    deliveryDate: deliveryDate,
                  });
                  dispatch(setLoadingButton(false));
                  refreshTable();
                  toast.success("Pedido enviado exitosamente");
                  closeModal();
                } catch (error) {
                  dispatch(setLoadingButton(false));
                }
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
