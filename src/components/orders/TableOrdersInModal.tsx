import { ChangeEvent, FC, useEffect, useState } from "react";
import { IClientOrder, IOrderModal, Order } from "../../interfaces";
import { TiDelete } from "react-icons/ti";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";
import OrdersService from "../../services/orders/ordersService";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../customs/DataTable";

interface Props {
  orders: IOrderModal[] | undefined;
  refreshTable: () => void;
  closeModalOrderTable: () => void;
  clientOrder: IClientOrder | undefined;
}

export const TableOrdersInModal: FC<Props> = ({
  orders,
  refreshTable,
  closeModalOrderTable,
  clientOrder,
}) => {
  const dispatch = useDispatch();

  const [updatedCount, setUpdatedCount] = useState<number | undefined>(undefined);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [ordersTable, setOrdersTable] = useState<IOrderModal[] | undefined>([]);
  const [rowSelected, setRowSelected] = useState<Order>();
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeModalDelete = () => {
    setModalDeleteIsOpen(false);
  };

  useEffect(() => {
    setOrdersTable(orders);
  }, [orders]);

  const openModalDelete = (row: Order) => {
    setRowSelected(row);
    setModalDeleteIsOpen(true);
  };

  const handleDelete = async (
    orderId: string | undefined,
    productId: string | undefined
  ) => {
    try {
      dispatch(setLoadingButton(true));
      await OrdersService.deleteProductOrder(orderId, productId);
      dispatch(setLoadingButton(false));

      setOrdersTable((prevState: IOrderModal[] | undefined) => {
        const filterProductOrder = prevState?.filter(
          (productOrder) => productOrder.product.id !== productId
        );

        if (!filterProductOrder || filterProductOrder.length === 0) {
          refreshTable();
          closeModalOrderTable();
        }

        return filterProductOrder;
      });
      refreshTable();
    } catch (error) {
      dispatch(setLoadingButton(false));
    }
  };

  const openModalEdit = (row: Order) => {
    setRowSelected(row);
    setModalEditIsOpen(true);
  };

  const closeModalEdit = () => {
    setModalEditIsOpen(false);
  };

  const handleEdit = async () => {
    try {
      setOrdersTable((prevState: IOrderModal[] | undefined) => {
        return prevState?.map((ctProduct) => {
          if (ctProduct.id === rowSelected?.id) {
            return {
              ...ctProduct,
              count: updatedCount || 0,
            };
          }
          return ctProduct;
        });
      });

      dispatch(setLoadingButton(true));
      await OrdersService.editProductCount({
        orderId: rowSelected?.id,
        productId: rowSelected?.product.id,
        count: updatedCount,
      });

      refreshTable();
      dispatch(setLoadingButton(false));
      toast.success("Cantidad editada correctamente");
      closeModalEdit();
    } catch (error: unknown) {
      dispatch(setLoadingButton(false));
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocurrió un error al procesar la solicitud");
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setUpdatedCount(value === "" ? undefined : Number(value));
    }
  };

  useEffect(() => {
    setUpdatedCount(rowSelected?.count);
  }, [rowSelected?.count, modalEditIsOpen]);

  const columns: ColumnDef<IOrderModal>[] = [
    {
      id: "product",
      header: "Producto",
      cell: ({ row }) => (
        <span className={`text-grey-70 ${isMobile ? "text-sm" : ""}`}>
          {row.original.product.name}
        </span>
      ),
    },
    {
      id: "quantity",
      header: "Cantidad",
      cell: ({ row }) => (
        <div className={`text-grey-70 flex items-center ${isMobile ? "text-sm" : ""}`}>
          <small>{row.original.count}</small>
          <small>{row.original.unit}</small>
          <div className="px-2">
            <BiSolidEdit
              className={`cursor-pointer ${isMobile ? "text-sm" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                openModalEdit(row.original);
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: "price",
      header: "Precio por unidad",
      cell: ({ row }) => (
        <span className={`text-grey-70 ${isMobile ? "text-sm" : ""}`}>
          ${row.original.price}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Acción</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <TiDelete
            color="#F44336"
            className="cursor-pointer"
            size={isMobile ? 20 : 24}
            onClick={(e) => {
              e.stopPropagation();
              openModalDelete(row.original);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className={`${isMobile ? "overflow-x-auto w-full" : ""}`}>
        <DataTable
          columns={columns}
          data={ordersTable || []}
          className="bg-white"
        />
      </div>

      <div
        className={`flex ${
          isMobile ? "justify-end mt-3" : "justify-end mt-2"
        } text-white ${isMobile ? "text-base" : "text-xl"} w-full`}
      >
        {clientOrder?.discount ? (
          <small
            className={`text-green font-semibold ${isMobile ? "px-1" : "px-2"}`}
          >
            {clientOrder.discount}% descuento
          </small>
        ) : null}
        <div
          className={`flex justify-start ${
            isMobile ? "min-w-28 px-2" : "min-w-36 px-3"
          } bg-grey-50`}
        >
          <p>
            Total: <small className="font-medium">${clientOrder?.total}</small>
          </p>
        </div>
      </div>

      <EditProductModal
        closeModal={closeModalEdit}
        count={updatedCount}
        modalIsOpen={modalEditIsOpen}
        product={rowSelected?.product.name}
        handleChange={handleChange}
        handleEdit={handleEdit}
        title="cantidad"
      />
      <DeleteProductModal
        closeModal={closeModalDelete}
        modalIsOpen={modalDeleteIsOpen}
        product={rowSelected?.product}
        orderId={rowSelected?.id}
        handleDelete={(id) => handleDelete(id, rowSelected?.product.id)}
      />
    </div>
  );
};
