import { ChangeEvent, FC, useEffect, useState } from "react";
import { IClientOrder, IOrderModal, Order } from "../../interfaces";
import { TiDelete } from "react-icons/ti";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";
import OrdersService from "../../services/orders/ordersService";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch } from "react-redux";

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

  const [updatedCount, setUpdatedCount] = useState<number | undefined | null>(
    null
  );
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [ordersTable, setOrdersTable] = useState<IOrderModal[] | undefined>([]);
  const [rowSelected, setRowSelected] = useState<Order>();
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const columns = ["Producto", "Cantidad", "Precio por unidad", "Acción"];

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
    orderId: number | undefined,
    productId: number | undefined
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
    } catch (error: Error | AxiosError | any) {
      dispatch(setLoadingButton(false));
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocurrió un error al procesar la solicitud");
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setUpdatedCount(Number(value));
    }
  };

  useEffect(() => {
    setUpdatedCount(rowSelected?.count);
  }, [rowSelected?.count, modalEditIsOpen]);

  console.log(clientOrder);

  return (
    <div>
      <table className="w-full rounded-sm overflow-hidden">
        <thead className="bg-grey-50 h-11">
          <tr>
            {columns.map((col, i) => {
              const textAlignClass =
                i === columns.length - 1 ? "text-end" : "text-start";
              return (
                <th
                  key={col}
                  className={`text-white font-semibold px-4 ${textAlignClass}`}
                >
                  {col}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="">
          {ordersTable?.map((row, rowIndex) => (
            <>
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "" : "bg-grey"}
              >
                <td key={rowIndex} className="text-grey-70 px-4">
                  {row.product.name}
                </td>
                <td
                  key={rowIndex}
                  className="text-grey-70 px-4 flex items-center"
                >
                  <small> {row.count}</small>
                  <small> {row.unit}</small>
                  <div
                    className="px-2"
                    onClick={() => {
                      openModalEdit(row);
                    }}
                  >
                    <BiSolidEdit className="cursor-pointer" />
                  </div>
                </td>
                <td key={rowIndex} className="text-grey-70 px-4 text-start">
                  ${row.price}
                </td>
                <td
                  key={rowIndex}
                  className="text-grey-70 px-7 flex justify-end py-2"
                >
                  <TiDelete
                    color="#F44336"
                    className="cursor-pointer"
                    size={24}
                    onClick={() => {
                      openModalDelete(row);
                    }}
                  />
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end text-white text-xl  w-full">
        {clientOrder?.discount ? <small className="text-green font-semibold px-2">10% descuento</small> : null}
        <div className="flex justify-start min-w-36 px-3 bg-grey-50 ">
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
        handleDelete={handleDelete}
      />
    </div>
  );
};
