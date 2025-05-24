import { FC, useState, useEffect } from "react";
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

export const ShowOrderModal: FC<Props> = ({
  modalIsOpen,
  closeModal,
  clientOrder,
  refreshTable,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update mobile state when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      width: isMobile ? "95%" : 775,
      height: isMobile ? "auto" : 330,
      maxHeight: isMobile ? "85vh" : "auto",
      padding: 0,
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Order Modal"
      ariaHideApp={false}
    >
      <div className="flex flex-col h-full justify-between w-full">
        <div className="w-full">
          <div className={`flex justify-between items-center w-full ${isMobile ? 'px-2 py-2' : 'px-3 py-3'}`}>
            <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-medium text-black`}>
              Pedido de: <small>{clientOrder?.client}</small>
            </p>
            <button onClick={closeModal} className="p-1">
              <FaTimes size={isMobile ? 22 : 28} color="#B8B8B8" />
            </button>
          </div>

          <hr className="border-grey w-full" />
        </div>
        
        <div className={`overflow-auto w-full ${isMobile ? 'mx-0 my-1 px-1' : 'mx-7 my-3'} ${isMobile ? 'max-h-[50vh]' : 'max-h-[220px]'} scrollbar`}>
          <TableOrdersInModal
            orders={clientOrder?.order}
            clientOrder={clientOrder}
            refreshTable={refreshTable}
            closeModalOrderTable={closeModal}
          />
        </div>
        
        <div className="w-full">
          <hr className="border-grey w-full" />
          <div className={`flex justify-end gap-x-2 w-full ${isMobile ? 'px-2 my-2' : 'px-3 my-3'}`}>
            <Button
              legend="Salir"
              size={isMobile ? "md" : "xl"}
              height={isMobile ? "30px" : "36px"}
              width={isMobile ? "80px" : "130px"}
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
