import { FC } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  message: string;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: 500,
    height: 180,
    padding: 0,
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export const ModalLoginError: FC<Props> = ({ modalIsOpen, closeModal }) => {
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
            <p className="text-2xl font-medium text-black">
              Usuario incorrecto
            </p>
            <button onClick={closeModal}>
              <FaTimes size={28} color="#B8B8B8" />
            </button>
          </div>

          <hr className=" border-grey" />
        </div>

        <div className="my-2 text-center">
          <p className="font-medium text-lg text-danger">
            El usuario o la contraseña son incorrectos
          </p>
        </div>

        <div className="flex flex-col">
          <hr className=" border-grey" />
          <div className="flex justify-end py-3 gap-x-2.5 mx-3">
            <Button
              legend="Aceptar"
              size="xl"
              height="36px"
              width="130px"
              color="blue"
              weight="font-light"
              onClick={closeModal}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
