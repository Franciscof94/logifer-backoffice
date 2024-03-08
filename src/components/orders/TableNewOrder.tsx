import React, { FC, useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { BiSolidEdit } from "react-icons/bi";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";
import { IOrderTable } from "../../interfaces";
interface Props {
  data: IOrderTable[];
  setNewOrders: (order: any) => void;
  handleDelete: (id: number | undefined) => void;
}

export const TableNewOrder: FC<Props> = ({
  data,
  setNewOrders,
  handleDelete,
}) => {
  const [modalDeleteIsOpen, setIsOpenModalDelete] = useState(false);
  const [modalEditIsOpen, setIsOpenModalEdit] = useState(false);
  const [arrayProducts, setArrayProducts] = useState<IOrderTable[]>([]);
  const [rowSelected, setRowSelected] = useState<IOrderTable>();
  const [updatedCount, setUpdatedCount] = useState<number | null | undefined>(
    null
  );
  const columns = ["Producto", "Cantidad", "Dirección", "Acción"];

  const openModalDelete = (row: IOrderTable) => {
    setIsOpenModalDelete(true);
    setRowSelected(row);
  };

  const closeModalDelete = () => {
    setIsOpenModalDelete(false);
  };

  const openModalEdit = (row: IOrderTable) => {
    setIsOpenModalEdit(true);
    setRowSelected(row);
  };

  const closeModalEdit = () => {
    setIsOpenModalEdit(false);
  };

  useEffect(() => {
    setArrayProducts(data);
  }, [data]);

  const handleEdit = () => {
    setNewOrders((prevState: IOrderTable[]) => {
      return prevState.map((ctProduct) => {
        if (ctProduct.id === rowSelected?.product.id) {
          return {
            ...ctProduct,
            count: updatedCount,
          };
        }
        return ctProduct;
      });
    });
    closeModalEdit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setUpdatedCount(Number(value));
    }
  };

  useEffect(() => {
    setUpdatedCount(rowSelected?.count);
  }, [rowSelected?.count, modalEditIsOpen]);

  const total = arrayProducts?.reduce((acc: number, row: any) => {
    const price = parseFloat(row.price.toString().replace("$", ""));
    if (row.count) return acc + price * row.count;
    return acc;
  }, 0);

  return (
    <div className="w-[815px]">
      <div className="overflow-auto max-h-56 scrollbar">
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
          <tbody className="bg-white">
            {arrayProducts.length ? (
              arrayProducts.map((row, rowIndex: number) => (
                <React.Fragment key={rowIndex}>
                  <tr key={rowIndex} className="">
                    <td key={rowIndex} className="text-grey-70 px-4 py-2">
                      {row.product.name}
                    </td>

                    <td key={rowIndex} className="text-grey-70 px-4 py-2">
                      <div className="flex items-center">
                        {" "}
                        <div>
                          {row.count}
                          {row.unit}
                        </div>
                        <div
                          className="px-2"
                          onClick={() => {
                            openModalEdit(row);
                          }}
                        >
                          <BiSolidEdit className="cursor-pointer" />
                        </div>
                      </div>
                    </td>

                    <td key={rowIndex} className="text-grey-70 px-4 py-2">
                      {row.address}
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
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center font-normal text-xl text-black py-2"
                >
                  No hay productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <DeleteProductModal
          closeModal={closeModalDelete}
          modalIsOpen={modalDeleteIsOpen}
          orderId={rowSelected?.id}
          product={rowSelected?.product}
          handleDelete={handleDelete}
        />
        <EditProductModal
          closeModal={closeModalEdit}
          modalIsOpen={modalEditIsOpen}
          product={rowSelected?.product.name}
          count={updatedCount}
          handleEdit={handleEdit}
          handleChange={handleChange}
          title="producto"
        />
      </div>
      <div className="w-full flex justify-end">
        <div
          className="w-40 bg-grey-50 flex items-center px-3"
          style={{ borderRadius: "0 0 4px 0" }}
        >
          <p className="text-xl text-white">Total:</p>
          <small className=" text-lg text-white font-medium px-3">
            ${total}
          </small>
        </div>
      </div>
    </div>
  );
};
