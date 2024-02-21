import React, { CSSProperties, FC, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { BiSolidEdit } from "react-icons/bi";
import { Pagination } from "../pagination/Pagination";
import { EditClientModal } from "./EditClientModal";
import { DeleteClientModal } from "./DeleteClientModal";
import { IClient } from "../../interfaces";
import { IPagination } from "../../interfaces/Pagination.interface";
import ClientsService from "../../services/clients/clientsServices";
import { ToastContainer, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";
import { setLoadingButton } from "../../store/slices/uiSlice";

interface Props {
  refreshTable: (page?: number, size?: number) => void;
  clients: IClient[] | undefined;
  pagination: IPagination | undefined;
}

const override: CSSProperties = {
  display: "block",
  margin: "3px auto",
  borderColor: "#3342B1",
};

export const TableClients: FC<Props> = ({
  refreshTable,
  clients,
  pagination,
}) => {
  const dispatch = useDispatch();
  const [modalDeleteIsOpen, setIsOpenModalDelete] = useState(false);
  const [modalEditIsOpen, setIsOpenModalEdit] = useState(false);
  const [clientSelected, setClientSelected] = useState<IClient>();
  const { loadingTableOrders } = useSelector((state: any) => state.ordersData);

  const columns = [
    "Nombre y apellido",
    "Dirección",
    "Email",
    "Teléfono",
    "Acción",
  ];

  const openModalDelete = (row: IClient) => {
    setIsOpenModalDelete(true);
    setClientSelected(row);
  };

  const closeModalDelete = () => {
    setIsOpenModalDelete(false);
  };

  const openModalEdit = (row: IClient) => {
    setIsOpenModalEdit(true);
    setClientSelected(row);
  };

  const closeModalEdit = () => {
    setIsOpenModalEdit(false);
  };

  const handleChangePage = (page: number) => {
    refreshTable(page, 9);
  };

  const handleDelete = async () => {
    try {
      dispatch(setLoadingButton(true));
      await ClientsService.deleteClient(clientSelected?.id);
      dispatch(setLoadingButton(false));
      toast.error("Cliente eliminado correctamente");
      refreshTable();
      closeModalDelete();
    } catch (error: Error | AxiosError | any) {
      dispatch(setLoadingButton(false));
      toast.error(error.message);
    }
  };

  return (
    <div className="">
      <div className=" max-h-[380px]">
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
              ) : clients?.length ? (
                clients?.map((row, rowIndex: number) => (
                  <React.Fragment key={rowIndex}>
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? "" : "bg-grey"}
                    >
                      <td key={rowIndex} className="text-grey-70 px-4 py-2">
                        {row.nameAndLastname}
                      </td>
                      <td key={rowIndex} className="text-grey-70 px-4 py-2">
                        {row.address}
                      </td>
                      <td key={rowIndex} className="text-grey-70 px-4 py-2">
                        {row.email}
                      </td>
                      <td key={rowIndex} className="text-grey-70 px-4 py-2">
                        {row.phone}
                      </td>
                      <td
                        key={rowIndex}
                        className="text-grey-70 px-4 flex justify-end py-2"
                      >
                        <div className="flex items-center">
                          <div
                            className="px-1 "
                            onClick={() => {
                              openModalEdit(row);
                            }}
                          >
                            <BiSolidEdit className="cursor-pointer" />
                          </div>
                          <div
                            onClick={() => {
                              openModalDelete(row);
                            }}
                          >
                            <TiDelete
                              color="#F44336"
                              size={24}
                              className="cursor-pointer "
                            />
                          </div>
                        </div>
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
                    No hay clientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>{" "}
      <ToastContainer />
      <div className="flex justify-end mt-12">
        <Pagination
          currentPage={pagination?.page ?? 0}
          onChangePage={handleChangePage}
          totalItems={pagination?.totalElements ?? 0}
          filasPorPaginas={pagination?.size}
        />
      </div>
      <EditClientModal
        client={clientSelected}
        closeModal={closeModalEdit}
        modalIsOpen={modalEditIsOpen}
        refreshTable={refreshTable}
      />
      <DeleteClientModal
        client={clientSelected}
        closeModal={closeModalDelete}
        modalIsOpen={modalDeleteIsOpen}
        handleDelete={handleDelete}
      />
    </div>
  );
};
