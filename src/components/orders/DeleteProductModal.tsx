import { FC } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  product: {
    id: number | undefined;
    productName: string | undefined;
  };
  handleDelete: (id?: number | undefined) => void;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: 486,
    height: 210,
    padding: 0,
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export const DeleteProductModal: FC<Props> = ({
  modalIsOpen,
  closeModal,
  product,
  handleDelete,
}) => {
  const { isLoadingButton } = useSelector((state: any) => state.uiData);

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
            <p className="text-2xl font-medium text-black">Eliminar producto</p>
            <button onClick={closeModal}>
              <FaTimes size={28} color="#B8B8B8" />
            </button>
          </div>

          <hr className=" border-grey" />
        </div>

        <div className="my-4 text-center">
          <p className="font-light text-black">
            ¿Estás seguro de que deseas eliminar este producto
            <span className="font-medium"> {product?.productName}</span>?
          </p>
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
              onClick={closeModal}
            />
            <Button
              legend="Eliminar"
              size="xl"
              disabled={isLoadingButton}
              isLoading={isLoadingButton}
              height="36px"
              width="130px"
              color="blue"
              weight="font-light"
              onClick={async () => {
                handleDelete(product?.id);
                toast.success("Producto eliminado exitosamente");
                closeModal();
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
