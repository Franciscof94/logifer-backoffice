import { ChangeEvent, FC, useState } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Data } from "../../interfaces";
import OrdersService from "../../services/orders/ordersService";
import { InputText } from "../customs/InputText";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  refreshTable: () => void;
  order: Data | undefined;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: 530,
    height: 280,
    padding: 0,
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export const CheckOrderModal: FC<Props> = ({
  modalIsOpen,
  closeModal,
  refreshTable,
  order,
}) => {
  const [deliveryDate, setDeliveryDate] = useState("");

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="">
          <div className="flex justify-between items-center px-3 py-3">
            <p className="text-2xl font-medium text-black">Actualizar pedido</p>
            <button onClick={closeModal}>
              <FaTimes size={28} color="#B8B8B8" />
            </button>
          </div>

          <hr className=" border-grey" />
        </div>

        <div className="my-4 text-center">
          <p className="font-lg font-xl text-black">
            ¿Estás seguro de que deseas marcar este pedido como enviado?
          </p>
          <div className="px-12">
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
          <div className="flex justify-end gap-x-2.5 px-3 my-3">
            <Button
              legend="Cancelar"
              size="xl"
              height="36px"
              width="130px"
              color="grey-50"
              weight="font-light"
              onClick={() => {
                closeModal();
                setDeliveryDate("");
              }}
            />
            <Button
              legend="Aceptar"
              size="xl"
              height="36px"
              disabled={deliveryDate ? false : true}
              width="130px"
              color="blue"
              weight="font-light"
              onClick={async () => {
                try {
                  await OrdersService.markAsSent({
                    orderId: order?.id,
                    deliveryDate: deliveryDate,
                  });
                  refreshTable();
                  toast.success("Pedido enviado exitosamente");
                  closeModal();
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
