import React, { FC, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { BiSolidEdit } from "react-icons/bi";
import { Pagination } from "../pagination/Pagination";
import { EditClientModal } from "./EditClientModal";
import { DeleteClientModal } from "./DeleteClientModal";
import { IClient } from "../../interfaces";
import { IPagination } from "../../interfaces/Pagination.interface";
import ClientsService from "../../services/clients/clientsServices";
import { ToastContainer } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../customs/DataTable";

interface Props {
  refreshTable: (page?: number, size?: number) => void;
  clients: IClient[] | undefined;
  pagination: IPagination | undefined;
  loadingTableOrders?: boolean;
}

export const TableClients: FC<Props> = ({
  refreshTable,
  clients = [],
  pagination,
  loadingTableOrders,
}) => {
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState<IClient>();

  const openModalDelete = (row: IClient) => {
    setRowSelected(row);
    setModalDeleteIsOpen(true);
  };

  const closeModalDelete = () => {
    setModalDeleteIsOpen(false);
  };

  const openModalEdit = (row: IClient) => {
    setRowSelected(row);
    setModalEditIsOpen(true);
  };

  const closeModalEdit = () => {
    setModalEditIsOpen(false);
  };

  const handleDelete = async (id: number | undefined) => {
    try {
      await ClientsService.deleteClient(id);
      refreshTable();
      closeModalDelete();
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnDef<IClient>[] = [
    {
      id: "nameAndLastname",
      header: "Nombre y Apellido",
      cell: ({ row }) => <span>{row.original.nameAndLastname}</span>,
    },
    {
      id: "phone",
      header: "Teléfono",
      cell: ({ row }) => <span>{row.original.phone}</span>,
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
      id: "address",
      header: "Dirección",
      cell: ({ row }) => <span>{row.original.address}</span>,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex justify-center gap-4">
          <BiSolidEdit
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openModalEdit(row.original);
            }}
          />
          <TiDelete
            color="#F44336"
            className="cursor-pointer"
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
    <div>
      <div className="max-h-[380px]">
        <DataTable
          columns={columns}
          data={clients}
          isLoading={loadingTableOrders}
          className="bg-white"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={pagination?.page ?? 0}
          onChangePage={(page) => refreshTable(page)}
          totalItems={pagination?.totalElements ?? 0}
          filasPorPaginas={pagination?.size}
        />
      </div>

      <DeleteClientModal
        closeModal={closeModalDelete}
        modalIsOpen={modalDeleteIsOpen}
        client={rowSelected}
        handleDelete={handleDelete}
      />

      <EditClientModal
        closeModal={closeModalEdit}
        modalIsOpen={modalEditIsOpen}
        client={rowSelected}
        refreshTable={refreshTable}
      />

      <ToastContainer />
    </div>
  );
};
