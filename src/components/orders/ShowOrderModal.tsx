import { FC } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";
import { TableOrdersInModal } from "./TableOrdersInModal";
import { IClientOrder } from "../../interfaces";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  clientOrder: IClientOrder | undefined;
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
    height: 330,
    padding: 0,
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export const ShowOrderModal: FC<Props> = ({
  modalIsOpen,
  closeModal,
  clientOrder,
  refreshTable,
}) => {

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
            <p className="text-2xl font-medium text-black">
              Pedido de: <small>{clientOrder?.client}</small>
            </p>
            <button onClick={closeModal}>
              <FaTimes size={28} color="#B8B8B8" />
            </button>
          </div>

          <hr className=" border-grey" />
        </div>
        <div className="overflow-auto mx-7 my-3 max-h-[220px] scrollbar">
          <TableOrdersInModal
            orders={clientOrder?.order}
            refreshTable={refreshTable}
            closeModalOrderTable={closeModal}
          />
        </div>
        <div className="">
          <hr className=" border-grey" />
          <div className="flex justify-end gap-x-2.5 px-3 my-3">
            <Button
              legend="Salir"
              size="xl"
              height="36px"
              width="130px"
              color="grey-50"
              weight="font-light"
              onClick={closeModal}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
