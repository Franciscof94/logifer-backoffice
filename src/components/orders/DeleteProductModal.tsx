import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { CustomSheet } from "../customs/CustomSheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  product:
    | {
        id: string;
        name: string;
      }
    | undefined;
  orderId?: string;
  handleDelete: (id: string | undefined) => void;
}

export const DeleteProductModal = ({
  modalIsOpen,
  closeModal,
  product,
  orderId,
  handleDelete,
}: Props) => {
  const dispatch = useDispatch();
  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeleteProduct = async () => {
    dispatch(setLoadingButton(true));
    await handleDelete(orderId);
    dispatch(setLoadingButton(false));
    closeModal();
  };

  const content = (
    <>
      <div className="py-4">
        <p className="text-gray-500">
          ¿Estás seguro que deseas eliminar el producto{" "}
          <span className="font-medium text-gray-900">{product?.name}</span>?
        </p>
      </div>

      <div className="flex justify-end gap-x-3 w-full">
        <button
          onClick={closeModal}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[6px] hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleDeleteProduct}
          disabled={isLoadingButton}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-[6px] hover:bg-red-700 disabled:opacity-50"
        >
          {isLoadingButton ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <CustomSheet
        open={modalIsOpen}
        onOpenChange={(open) => !open && closeModal()}
        title="Eliminar producto"
      >
        {content}
      </CustomSheet>
    );
  }

  return (
    <Dialog open={modalIsOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        className="sm:max-w-[425px] bg-white"
        style={{
          borderRadius: 6,
        }}
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-medium text-gray-900">
            Eliminar producto
          </DialogTitle>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
};
