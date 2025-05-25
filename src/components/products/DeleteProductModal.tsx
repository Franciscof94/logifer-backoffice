import { FC } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";
import { IProduct } from "../../interfaces";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  product: IProduct | undefined;
  handleDelete: (id: number | undefined) => void;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: 500,
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
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="flex flex-col justify-between h-full">
        <div className="">
          <div className="flex justify-between items-center p-3">
            <p className="text-2xl font-medium text-black">Eliminar producto</p>
            <button onClick={closeModal}>
              <FaTimes size={28} color="#B8B8B8" />
            </button>
          </div>

          <hr className=" border-grey" />
        </div>

        <div className="my-2 text-center">
          <p className="font-light text-black">
            ¿Estás seguro de que deseas eliminar este producto
            <span className="font-medium"> {product?.productName}</span>?
          </p>
        </div>

        <div className="flex flex-col">
          <hr className=" border-grey" />
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
              legend="Eliminar"
              size="xl"
              height="36px"
              width="130px"
              color="blue"
              weight="font-light"
              onClick={() => {
                handleDelete(product?.id);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
