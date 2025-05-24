import React, { FC, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { BiSolidEdit } from "react-icons/bi";
import { IProduct } from "../../interfaces";
import { DeleteProductModal } from "./DeleteProductModal";
import { EditProductModal } from "./EditProductModal";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../customs/DataTable";
import ProductsService from "../../services/products/productsService";

interface Props {
  products: IProduct[];
  refreshTable: () => void;
  loadingTableOrders?: boolean;
}

export const TableProducts: FC<Props> = ({
  products,
  refreshTable,
  loadingTableOrders,
}) => {
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState<IProduct>();

  const openModalDelete = (row: IProduct) => {
    setRowSelected(row);
    setModalDeleteIsOpen(true);
  };

  const closeModalDelete = () => {
    setModalDeleteIsOpen(false);
  };

  const openModalEdit = (row: IProduct) => {
    setRowSelected(row);
    setModalEditIsOpen(true);
  };

  const closeModalEdit = () => {
    setModalEditIsOpen(false);
  };

  const handleDelete = async (id: number | undefined) => {
    try {
      await ProductsService.deleteProduct(id);
      refreshTable();
      closeModalDelete();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id: number | undefined) => {
    if (!rowSelected) return;
    try {
      await ProductsService.patchProduct(id, rowSelected);
      refreshTable();
      closeModalEdit();
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnDef<IProduct>[] = [
    {
      id: "productName",
      header: "Nombre",
      cell: ({ row }) => <span>{row.original.productName}</span>,
    },
    {
      id: "price",
      header: "Precio",
      cell: ({ row }) => <span>${row.original.price}</span>,
    },
    {
      id: "stock",
      header: "Stock",
      cell: ({ row }) => <span>{row.original.stock}</span>,
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
          data={products}
          isLoading={loadingTableOrders}
          className="bg-white"
        />
      </div>

      <DeleteProductModal
        closeModal={closeModalDelete}
        modalIsOpen={modalDeleteIsOpen}
        product={rowSelected}
        handleDelete={handleDelete}
      />

      <EditProductModal
        closeModal={closeModalEdit}
        modalIsOpen={modalEditIsOpen}
        product={rowSelected}
        handleEdit={handleEdit}
        refreshTable={refreshTable}
      />
    </div>
  );
};
