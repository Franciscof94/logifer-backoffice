import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { CustomSheet } from "../customs/CustomSheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  product?: string;
  count?: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEdit: () => void;
  title: string;
}

export const EditProductModal = ({
  modalIsOpen,
  closeModal,
  product,
  count,
  handleChange,
  handleEdit,
  title,
}: Props) => {
  const dispatch = useDispatch();
  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);
  const isMobile = useIsMobile(768);

  const handleEditProduct = async () => {
    dispatch(setLoadingButton(true));
    await handleEdit();
    dispatch(setLoadingButton(false));
    closeModal();
  };

  const content = (
    <>
      <div className="py-4">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="product"
              className="block text-sm font-medium text-gray-700"
            >
              Producto
            </label>
            <input
              type="text"
              id="product"
              value={product}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-[6px] text-gray-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="count"
              className="block text-sm font-medium text-gray-700"
            >
              {title}
            </label>
            <input
              type="number"
              id="count"
              value={count}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-[#3342B1] focus:border-transparent sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-x-3 w-full">
        <button
          onClick={closeModal}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[6px] hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleEditProduct}
          disabled={isLoadingButton}
          className="px-4 py-2 text-sm font-medium text-white bg-[#3342B1] rounded-[6px] hover:bg-[#2A3690] disabled:opacity-50"
        >
          {isLoadingButton ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <CustomSheet
        open={modalIsOpen}
        onOpenChange={(open) => !open && closeModal()}
        title={`Editar ${title}`}
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
            Editar {title}
          </DialogTitle>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
};
