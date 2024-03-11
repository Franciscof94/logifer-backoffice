import { FC } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { Button } from "../customs/Button";
import { InputNumber } from "../customs/InputNumber";
import { useSelector } from "react-redux";
import { InputText } from "../customs/InputText";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  product: string | undefined;
  count: number | null | undefined;
  handleEdit: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
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

export const EditProductModal: FC<Props> = ({
  modalIsOpen,
  closeModal,
  product,
  count,
  handleEdit,
  handleChange,
  title,
}) => {
  const { isLoadingButton } = useSelector((state: any) => state.uiData);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="">
        <div className="flex justify-between items-center px-3 py-1">
          <p className="text-2xl font-medium text-black">Editar {title}</p>
          <button onClick={closeModal}>
            <FaTimes size={28} color="#B8B8B8" />
          </button>
        </div>
        <hr className="my-2 border-grey" />
        <div className="my-4">
          <p className="text-black font-medium text-2xl flex justify-center">
            <small className=""> {product}</small>
          </p>
          <div>
            <InputNumber
              count={count}
              handleChange={handleChange}
              step="0.01"
            />
            {/* <InputText
              value={count || 0}
              placeholder="Cantidad"
              type="number"
              step="0.01"
              handleChange={handleChange}
            /> */}
          </div>
        </div>
        <hr className="my-2 border-grey" />
        <div className="flex justify-end gap-x-2.5 px-3">
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
            isLoading={isLoadingButton}
            disabled={isLoadingButton}
            height="36px"
            width="130px"
            color="blue"
            weight="font-light"
            onClick={handleEdit}
          />
        </div>
      </div>
    </Modal>
  );
};
