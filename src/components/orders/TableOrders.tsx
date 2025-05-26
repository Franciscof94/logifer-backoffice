import { FC, useState, useEffect, useMemo } from "react";
import { TiDelete } from "react-icons/ti";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import { Pagination } from "../pagination/Pagination";
import { Data, IClientOrder } from "../../interfaces";
import { CheckOrderModal } from "./CheckOrderModal";
import { ColumnDef } from "@tanstack/react-table";
import { useOrders } from "../../hooks/queries/useOrders";
import { DataTable } from "../customs/DataTable";
import { formatTableDate } from "../../utils/dateUtils";
import { ShowOrderDrawer } from "./ShowOrderDrawer";
import { DeleteOrderDrawer } from "./DeleteOrderDrawer";
import { PartialShipmentDrawer } from "./PartialShipmentDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  page: number;
  onPageChange: (page: number) => void;
}

export const TableOrders: FC<Props> = ({ page, onPageChange }) => {
  const [drawerShowIsOpen, setIsOpenDrawerShow] = useState(false);
  const [deleteDrawerIsOpen, setDeleteDrawerIsOpen] = useState(false);
  const [shipmentDrawerIsOpen, setShipmentDrawerIsOpen] = useState(false);
  const [modalCheckOrderIsOpen, setIsOpenModalCheckOrder] = useState(false);
  const [clientSelected, setClientSelected] = useState<IClientOrder>();
  const [orderToDelete, setOrderToDelete] = useState<Data>();
  const [orderToShip, setOrderToShip] = useState<Data>();
  // Usamos una media query real para detectar dispositivos móviles
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Usamos matchMedia para una detección más confiable
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    // Función para actualizar el estado basado en la media query
    const updateIsMobile = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Verificar inmediatamente
    updateIsMobile(mediaQuery);

    // Agregar listener para cambios
    const listener = (e: MediaQueryListEvent) => updateIsMobile(e);
    mediaQuery.addEventListener("change", listener);

    // Limpiar
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const { data: ordersData, isLoading } = useOrders(page);
  const ordersDataProcessed = useMemo(() => {
    if (!ordersData) return null;

    if (
      ordersData &&
      typeof ordersData === "object" &&
      "data" in ordersData &&
      typeof ordersData.data === "object" &&
      ordersData.data !== null &&
      "data" in ordersData.data &&
      Array.isArray(ordersData.data.data)
    ) {
      const nestedData = ordersData.data as Record<string, unknown>;
      return {
        data: nestedData.data as Data[],
        page: nestedData.page as number,
        size: nestedData.size as number,
        totalElements: nestedData.totalElements as number,
        totalPages: nestedData.totalPages as number,
      };
    }

    if (ordersData && "data" in ordersData && Array.isArray(ordersData.data)) {
      return ordersData;
    }

    return null;
  }, [ordersData]);

  const handleCheckOrder = async (e: React.MouseEvent, order: Data) => {
    e.stopPropagation();

    // Abrimos el drawer de envío parcial
    if (order) {
      setOrderToShip(order);
      setShipmentDrawerIsOpen(true);
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
                  openDrawerShow(data);
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
      cell: ({ row }) => {
        return formatTableDate(row.original.orderDate);
      },
    },
    {
      id: "client",
      header: "Cliente",
      cell: ({ row }) => <span>{row.original.client}</span>,
    },
    {
      id: "deliveryDate",
      header: "Fecha de entrega",
      cell: ({ row }) => row.original.deliveryDate,
    },
    {
      id: "discount",
      header: "Descuento",
      cell: ({ row }) => {
        const discount = row.original.discount;
        return discount ? (
          <span className="text-green-600">{discount}%</span>
        ) : (
          <span className="text-gray-500">-</span>
        );
      },
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
      id: "createdBy",
      header: "Creado por",
      cell: ({ row }) => <span>{row.original.createdBy || "-"}</span>,
    },
    {
      id: "send",
      header: "Pedido enviado",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end pr-3">
            {row.original.send ? (
              <div className="bg-green rounded-full p-1.5 flex items-center justify-center">
                <FaCheck className="text-white" size={14} />
              </div>
            ) : (
              <div className="relative">
                <TiDelete
                  onClick={(e) => {
                    row.original.id && handleCheckOrder(e, row.original);
                  }}
                  color="#F44336"
                  size={24}
                  className="cursor-pointer"
                />
                {/* El calendario ha sido reemplazado por el PartialShipmentDrawer */}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <FiMoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {!data.send && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      data.id && handleCheckOrder(e, data);
                    }}
                    className="cursor-pointer"
                  >
                    <FaCheck className="mr-2 h-4 w-4" />
                    <span>Marcar como enviado</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDrawer(data);
                  }}
                  className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
                >
                  <TiDelete className="mr-2 h-5 w-5" />
                  <span>Eliminar pedido</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const openDrawerShow = (order: IClientOrder) => {
    setIsOpenDrawerShow(true);
    setClientSelected(order);
  };

  const closeDrawerShow = () => {
    setIsOpenDrawerShow(false);
  };

  const closeModalCheckOrder = () => {
    setIsOpenModalCheckOrder(false);
  };

  const openDeleteDrawer = (order: Data) => {
    setOrderToDelete(order);
    setDeleteDrawerIsOpen(true);
  };

  const closeDeleteDrawer = () => {
    setDeleteDrawerIsOpen(false);
    setOrderToDelete(undefined);
  };

  const closeShipmentDrawer = () => {
    setShipmentDrawerIsOpen(false);
    setOrderToShip(undefined);
  };

  console.log("ISSS MOBIEL", isMobile);

  if (isMobile) {
    return (
      <div className="w-full py-4">
        {/* Drawer y modales para móvil */}
        <ShowOrderDrawer
          onClose={closeDrawerShow}
          isOpen={drawerShowIsOpen}
          clientOrder={clientSelected}
          refreshTable={() => {}}
        />

        <CheckOrderModal
          closeModal={closeModalCheckOrder}
          modalIsOpen={modalCheckOrderIsOpen}
          refreshTable={() => {}}
          order={undefined}
        />

        <DeleteOrderDrawer
          isOpen={deleteDrawerIsOpen}
          onClose={closeDeleteDrawer}
          order={orderToDelete}
        />

        <PartialShipmentDrawer
          isOpen={shipmentDrawerIsOpen}
          onClose={closeShipmentDrawer}
          order={orderToShip}
        />

        <ToastContainer />

        {/* Lista de tarjetas con espacio entre ellas */}
        <div className="flex flex-col space-y-4">
          {ordersDataProcessed?.data?.map((order: Data) => (
            <div
              key={order.id}
              className="rounded-md border border-gray-200 p-4 space-y-2 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">Cliente: {order.client}</span>
                <div className="flex items-center gap-2">
                  {order.send ? (
                    <div className="bg-green rounded-full p-1.5 flex items-center justify-center">
                      <FaCheck className="text-white" size={14} />
                    </div>
                  ) : (
                    <div className="relative">
                      <TiDelete
                        onClick={(e) => {
                          e.stopPropagation();
                          order.id && handleCheckOrder(e, order);
                        }}
                        color="#F44336"
                        size={24}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <FiMoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {!order.send && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            order.id && handleCheckOrder(e, order);
                          }}
                          className="cursor-pointer"
                        >
                          <FaCheck className="mr-2 h-4 w-4" />
                          <span>Marcar como enviado</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDrawer(order);
                        }}
                        className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
                      >
                        <TiDelete className="mr-2 h-5 w-5" />
                        <span>Eliminar pedido</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="space-y-2">
                <p>Fecha creación: {formatTableDate(order.orderDate)}</p>
                <p>Fecha entrega: {formatTableDate(order.deliveryDate)}</p>
                <p>Descuento: {order.discount ? `${order.discount}%` : "-"}</p>
                <p>Total: ${order.total}</p>
                <p>Dirección: {order.address}</p>
              </div>
              <div className="text-center mt-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDrawerShow(order);
                  }}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={ordersDataProcessed?.data || []}
        isLoading={isLoading}
        onRowClick={openDrawerShow}
        className="bg-white"
      />

      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={page}
          onChangePage={onPageChange}
          totalItems={ordersDataProcessed?.totalElements ?? 0}
          filasPorPaginas={ordersDataProcessed?.size}
        />
      </div>

      <ShowOrderDrawer
        onClose={closeDrawerShow}
        isOpen={drawerShowIsOpen}
        clientOrder={clientSelected}
        refreshTable={() => {}}
      />

      <CheckOrderModal
        closeModal={closeModalCheckOrder}
        modalIsOpen={modalCheckOrderIsOpen}
        refreshTable={() => {}}
        order={undefined}
      />

      <DeleteOrderDrawer
        isOpen={deleteDrawerIsOpen}
        onClose={closeDeleteDrawer}
        order={orderToDelete}
      />

      <PartialShipmentDrawer
        isOpen={shipmentDrawerIsOpen}
        onClose={closeShipmentDrawer}
        order={orderToShip}
      />

      <ToastContainer />
    </div>
  );
};
