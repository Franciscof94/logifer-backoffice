import { FC, useEffect, useState } from "react";
import { IOrderModal, Order } from "../../interfaces";
import { TiDelete } from "react-icons/ti";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";
import OrdersService from "../../services/orders/ordersService";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface Props {
  orders: IOrderModal[] | undefined;
  refreshTable: () => void;
  closeModalOrderTable: () => void;
}

export const TableOrdersInModal: FC<Props> = ({
  orders,
  refreshTable,
  closeModalOrderTable,
}) => {
  const [updatedCount, setUpdatedCount] = useState<number | null | undefined>(
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

  const handleDelete = async (id: number | undefined) => {
    try {
      await OrdersService.deleteProductOrder(id);
      setOrdersTable((prevState: IOrderModal[] | undefined) => {
        const filterProductOrder = prevState?.filter(
          (productOrder) => productOrder.id !== id
        );

        if (!filterProductOrder || filterProductOrder.length === 0) {
          refreshTable();
          closeModalOrderTable();
        }

        return filterProductOrder;
      });
    } catch (error) {
      console.log(error);
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
      await OrdersService.editProductCount({
        orderId: rowSelected?.id,
        count: updatedCount,
      });
      toast.success("Cantidad editada correctamente");
      closeModalEdit();
    } catch (error: Error | AxiosError | any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocurrió un error al procesar la solicitud");
      }
    }
  };

  const handleMinus = () => {
    const newCount = (updatedCount || 0) - 1;
    setUpdatedCount(newCount >= 1 ? newCount : 1);
  };

  const handlePlus = () => {
    let newCount;
    if (updatedCount === undefined) {
      newCount = 0.25;
    } else {
      if (updatedCount) {
        const roundedCount = Math.round(updatedCount * 4) / 4;
        newCount = roundedCount + 0.25;
      }
    }
    setUpdatedCount(newCount);
  };

  const total = ordersTable?.reduce((acc, row) => {
    const price = parseFloat(row.price.replace("$", ""));
    return acc + price * row.count;
  }, 0);

  useEffect(() => {
    setUpdatedCount(rowSelected?.count);
  }, [rowSelected?.count, modalEditIsOpen]);

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
                  {row.product}
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
                <td key={rowIndex} className="text-grey-70 px-4 text-end">
                  {row.price}
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
        <div className="flex justify-start min-w-36 px-3 bg-grey-50 ">
          <p>
            Total: <small className="font-medium">${total}</small>
          </p>
        </div>
      </div>
      <EditProductModal
        closeModal={closeModalEdit}
        count={updatedCount}
        modalIsOpen={modalEditIsOpen}
        product={rowSelected?.product}
        handleMinus={handleMinus}
        handleEdit={handleEdit}
        handlePlus={handlePlus}
        title="stock"
      />
      <DeleteProductModal
        closeModal={closeModalDelete}
        modalIsOpen={modalDeleteIsOpen}
        product={{
          id: rowSelected?.id,
          productName: rowSelected?.product,
        }}
        handleDelete={handleDelete}
      />
    </div>
  );
};
