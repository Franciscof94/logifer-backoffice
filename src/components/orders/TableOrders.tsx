import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ToastContainer } from "react-toastify";
import { ShowOrderModal } from "./ShowOrderModal";
import { Pagination } from "../pagination/Pagination";
import { Data, IClientOrder } from "../../interfaces";
import { CheckOrderModal } from "./CheckOrderModal";
import { ColumnDef } from "@tanstack/react-table";
import { useOrders } from "../../hooks/queries/useOrders";
import { useUpdateOrderStatus } from "../../hooks/mutations/useUpdateOrderStatus";
import { DataTable } from "../customs/DataTable";

interface Props {
  page: number;
  onPageChange: (page: number) => void;
}

export const TableOrders = ({ page, onPageChange }: Props) => {
  const [modalShowIsOpen, setIsOpenModalShow] = useState(false);
  const [modalCheckOrderIsOpen, setIsOpenModalCheckOrder] = useState(false);
  const [clientSelected, setClientSelected] = useState<IClientOrder>();
  const isMobile = window.innerWidth <= 640;

  const { data: ordersData, isLoading } = useOrders(page);
  const updateOrderStatus = useUpdateOrderStatus();

  const handleCheckOrder = async (order: Data) => {
    if (order.id) {
      await updateOrderStatus.mutateAsync(order.id);
    }
  };

  const columns: ColumnDef<Data>[] = [
    {
      id: "products",
      header: "Producto y cantidades",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex items-center gap-3">
            <div>
              <MdOutlineRemoveRedEye 
                className="cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  openModalShow(data);
                }}
              />
            </div>
            <span>
              {data.order[0]?.product?.name}{" "}
              {data.order.length > 1 ? `(+${data.order.length - 1})` : ""}
            </span>
          </div>
        );
      },
    },
    {
      id: "orderDate",
      header: "Fecha de creación",
      cell: ({ row }) => <span>{row.original.orderDate}</span>,
    },
    {
      id: "client",
      header: "Cliente",
      cell: ({ row }) => <span>{row.original.client}</span>,
    },
    {
      id: "deliveryDate",
      header: "Fecha de entrega",
      cell: ({ row }) => <span>{row.original.deliveryDate}</span>,
    },
    {
      id: "discount",
      header: "Descuento",
      cell: ({ row }) => (
        <span className="text-green-600">{row.original.discount}%</span>
      ),
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => <span>${row.original.total}</span>,
    },
    {
      id: "address",
      header: "Dirección",
      cell: ({ row }) => <span>{row.original.address}</span>,
    },
    {
      id: "send",
      header: "Pedido enviado",
      cell: ({ row }) => (
        <div className="flex justify-end pr-3">
          {row.original.send ? (
            <div className="bg-green-500 rounded-full p-1">
              <TiTick className="text-white" size={16} />
            </div>
          ) : (
            <TiDelete
              onClick={(e) => {
                e.stopPropagation();
                row.original.id && handleCheckOrder(row.original);
              }}
              color="#F44336"
              size={24}
              className="cursor-pointer"
            />
          )}
        </div>
      ),
    },
  ];

  const openModalShow = (order: IClientOrder) => {
    setIsOpenModalShow(true);
    setClientSelected(order);
  };

  const closeModalShow = () => {
    setIsOpenModalShow(false);
  };

  const closeModalCheckOrder = () => {
    setIsOpenModalCheckOrder(false);
  };

  if (isMobile) {
    return (
      <div className="w-full gap-4 py-4">
        {ordersData?.data.map((order) => (
          <div
            key={order.id}
            className="rounded-md border border-gray-200 p-3 space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold">Cliente: {order.client}</span>
              <div>
                {order.send ? (
                  <div className="bg-green-500 rounded-full p-1">
                    <TiTick className="text-white" size={16} />
                  </div>
                ) : (
                  <TiDelete
                    onClick={() => handleCheckOrder(order)}
                    color="#F44336"
                    size={24}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="space-y-2">
              <p>Fecha creación: {order.orderDate}</p>
              <p>Fecha entrega: {order.deliveryDate}</p>
              <p>Descuento: {order.discount}%</p>
              <p>Total: ${order.total}</p>
              <p>Dirección: {order.address}</p>
            </div>
            <div className="text-center mt-2">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => openModalShow(order)}
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={ordersData?.data || []}
        isLoading={isLoading}
        onRowClick={openModalShow}
        className="bg-white"
      />

      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={page}
          onChangePage={onPageChange}
          totalItems={ordersData?.totalElements ?? 0}
          filasPorPaginas={ordersData?.size}
        />
      </div>

      <ToastContainer />

      <ShowOrderModal
        closeModal={closeModalShow}
        modalIsOpen={modalShowIsOpen}
        clientOrder={clientSelected}
        refreshTable={() => {}}
      />

      <CheckOrderModal
        closeModal={closeModalCheckOrder}
        modalIsOpen={modalCheckOrderIsOpen}
        refreshTable={() => {}}
        order={undefined}
      />
    </div>
  );
};
