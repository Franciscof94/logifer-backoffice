import React, { CSSProperties, FC, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { ShowOrderModal } from "./ShowOrderModal";
import { Pagination } from "../pagination/Pagination";
import { Data, IClientOrder } from "../../interfaces";
import { CheckOrderModal } from "./CheckOrderModal";
import { IPagination } from "../../interfaces/Pagination.interface";

interface Props {
  refreshTable: (page?: number, size?: number) => void;
  orders: Data[] | undefined;
  pagination: IPagination | undefined;
}

const columns = [
  "Producto y cantidades",
  "Fecha de creación",
  "Cliente",
  "Fecha de entrega",
  "Dirección",
  "Pedido enviado",
];

const override: CSSProperties = {
  display: "block",
  margin: "3px auto",
  borderColor: "#3342B1",
};

export const TableOrders: FC<Props> = ({
  refreshTable,
  orders,
  pagination,
}) => {
  const [modalShowIsOpen, setIsOpenModalShow] = useState(false);
  const [modalCheckOrderIsOpen, setIsOpenModalCheckOrder] = useState(false);
  const [orderSelected, setOrderSelected] = useState<Data>();
  const [clientSelected, setClientSelected] = useState<IClientOrder>();

  const { loadingTableOrders } = useSelector((state: any) => state.ordersData);

  const openModalShow = (client: IClientOrder) => {
    setIsOpenModalShow(true);
    setClientSelected(client);
  };

  const closeModalShow = () => {
    /* refreshTable(); */
    setIsOpenModalShow(false);
  };

  const openModalCheckOrder = (order: Data) => {
    setIsOpenModalCheckOrder(true);
    setOrderSelected(order);
  };

  const closeModalCheckOrder = () => {
    setIsOpenModalCheckOrder(false);
  };

  const handleChangePage = (page: number) => {
    refreshTable(page, 9);
  };

  return (
    <div className="">
      <div className="max-h-[380px] scrollbar">
        <div className="rounded-[5px] shadow-lg">
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
              {loadingTableOrders ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center font-normal text-xl text-black py-2"
                  >
                    <ClipLoader
                      color={"#3342B1"}
                      loading={loadingTableOrders}
                      cssOverride={override}
                      size={35}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </td>
                </tr>
              ) : orders?.length ? (
                orders?.map((row, rowIndex: number) => (
                  <React.Fragment key={rowIndex}>
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 ? "bg-grey" : ""}
                    >
                      <td key={rowIndex} className="text-grey-70 px-4 py-2">
                        <div className="flex items-center">
                          {" "}
                          <div>Ver</div>
                          <div
                            className="px-2 "
                            onClick={() => openModalShow(row)}
                          >
                            <MdOutlineRemoveRedEye className="cursor-pointer" />
                          </div>
                        </div>
                      </td>
                      <td key={rowIndex} className="text-grey-70 px-4 py-2">
                        {row.orderDate}
                      </td>
                      <td key={rowIndex} className="text-grey-70 px-4 py-2">
                        {row.client}
                      </td>
                      <td key={rowIndex} className="text-grey-70 px-4 py-2">
                        {row.deliveryDate}
                      </td>
                      <td key={rowIndex} className="text-grey-70 px-4 py-2">
                        {row.address}
                      </td>
                      <td
                        key={rowIndex}
                        className="text-grey-70 px-14 flex justify-end  py-2"
                      >
                        {row.send ? (
                          <div className="h-6 w-6 flex justify-center items-center">
                            <div className="rounded-full bg-[#89C26D] h-4 w-4">
                              <TiTick color="white" size={16} />
                            </div>
                          </div>
                        ) : (
                          <TiDelete
                            onClick={() => {
                              openModalCheckOrder(row);
                            }}
                            color="#F44336"
                            size={24}
                            className="cursor-pointer"
                          />
                        )}
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
                    No hay ordenes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
      <ShowOrderModal
        closeModal={closeModalShow}
        modalIsOpen={modalShowIsOpen}
        clientOrder={clientSelected}
        refreshTable={refreshTable}
      />
      <CheckOrderModal
        closeModal={closeModalCheckOrder}
        modalIsOpen={modalCheckOrderIsOpen}
        refreshTable={refreshTable}
        order={orderSelected}
      />

      <div className="flex justify-end mt-12">
        <Pagination
          currentPage={pagination?.page ?? 0}
          onChangePage={handleChangePage}
          totalItems={pagination?.totalElements ?? 0}
          filasPorPaginas={pagination?.size}
        />
      </div>
    </div>
  );
};
