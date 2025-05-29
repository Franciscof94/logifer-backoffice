import { FC, useState, useMemo } from "react";
import { TiDelete } from "react-icons/ti";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck, FaTruck, FaMoneyBillWave, FaTrash } from "react-icons/fa";
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
import { PaymentStatusDrawer } from "./PaymentStatusDrawer";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  page: number;
  onPageChange: (page: number) => void;
}

const PaymentStatusCell: FC<{ row: Data; openPaymentDrawer: (order: Data) => void }> = ({ row, openPaymentDrawer }) => {
  const handleOpenDrawer = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openPaymentDrawer(row);
  };

  if (row.isPaid && row.paymentDate) {
    return (
      <div 
        className="flex flex-col items-center cursor-pointer py-1" 
        onClick={handleOpenDrawer}
      >
        <span className="px-2.5  inline-flex text-xs leading-5 font-semibold rounded-full bg-green text-white">
          Pago
        </span>
        <span className="text-xs text-gray-600 mt-1">
          {formatTableDate(row.paymentDate)}
        </span>
      </div>
    );
  }

  // Si no está pagado, mostrar el checkbox para iniciar el pago
  return (
    <div 
      className="flex flex-col items-center justify-center h-full" // Asegurar que el div ocupe espacio para ser clickeable
      onClick={handleOpenDrawer} // Todo el área es clickeable
    >
      <div 
        className="w-5 h-5 flex items-center justify-center cursor-pointer" 
        // onClick ya está en el div padre, no es necesario aquí si todo el área es clickeable
      >
        <input
          type="checkbox"
          checked={false} // Siempre desmarcado ya que si está pagado, se muestra el badge
          readOnly // El clic lo maneja el div contenedor
          className="cursor-pointer h-4 w-4"
        />
      </div>
    </div>
  );
};

export const TableOrders: FC<Props> = ({ page, onPageChange }) => {
  const [drawerShowIsOpen, setIsOpenDrawerShow] = useState(false);
  const [deleteDrawerIsOpen, setDeleteDrawerIsOpen] = useState(false);
  const [shipmentDrawerIsOpen, setShipmentDrawerIsOpen] = useState(false);
  const [paymentDrawerIsOpen, setPaymentDrawerIsOpen] = useState(false);
  const [modalCheckOrderIsOpen, setIsOpenModalCheckOrder] = useState(false);
  const [clientSelected, setClientSelected] = useState<IClientOrder>();
  const [orderToDelete, setOrderToDelete] = useState<Data>();
  const [orderToShip, setOrderToShip] = useState<Data>();
  const [orderToPay, setOrderToPay] = useState<Data>();
  const isMobile = useIsMobile();
  
  const queryClient = useQueryClient();

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
              {data.order?.[0]?.product?.name}{" "}
              {data.order?.length > 1 ? `(+${data.order.length - 1})` : ""}
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
      id: "paymentStatus",
      header: "Estado de Pago",
      cell: ({ row }) => <PaymentStatusCell row={row.original} openPaymentDrawer={openPaymentDrawer} />,
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
              <DropdownMenuContent align="end" className="w-56">
                {!data.send && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      data.id && handleCheckOrder(e, data);
                    }}
                    className="cursor-pointer"
                  >
                    <FaTruck className="mr-2 h-4 w-4" />
                    <span>Marcar como enviado</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    openPaymentDrawer(data);
                  }}
                  className="cursor-pointer"
                >
                  <FaMoneyBillWave className="mr-2 h-4 w-4" />
                  <span>{data.isPaid ? "Editar pago" : "Registrar pago"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDrawer(data);
                  }}
                  className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
                >
                  <FaTrash className="mr-2 h-4 w-4" />
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

  const openPaymentDrawer = (order: Data) => {
    // Cerrar cualquier otro drawer o modal que pudiera estar abierto
    setIsOpenDrawerShow(false);
    setDeleteDrawerIsOpen(false);
    setShipmentDrawerIsOpen(false);
    setIsOpenModalCheckOrder(false);
    
    // Ahora abrimos el drawer de pago
    setOrderToPay(order);
    setPaymentDrawerIsOpen(true);
  };

  const closePaymentDrawer = () => {
    setPaymentDrawerIsOpen(false);
    setOrderToPay(undefined);
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

        <PaymentStatusDrawer
          isOpen={paymentDrawerIsOpen}
          onClose={closePaymentDrawer}
          order={orderToPay}
          refreshTable={() => queryClient.invalidateQueries({ queryKey: ['orders'] })}
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
                    <DropdownMenuContent align="end" className="w-56">
                      {!order.send && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            order.id && handleCheckOrder(e, order);
                          }}
                          className="cursor-pointer"
                        >
                          <FaTruck className="mr-2 h-4 w-4" />
                          <span>Marcar como enviado</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openPaymentDrawer(order);
                        }}
                        className="cursor-pointer"
                      >
                        <FaMoneyBillWave className="mr-2 h-4 w-4" />
                        <span>{order.isPaid ? "Editar pago" : "Registrar pago"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDrawer(order);
                        }}
                        className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700"
                      >
                        <FaTrash className="mr-2 h-4 w-4" />
                        <span>Eliminar pedido</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="space-y-2">
                <p>Fecha creación: {formatTableDate(order.orderDate)}</p>
                <p>Fecha entrega: {order.deliveryDate}</p>
                <p>Descuento: {order.discount ? `${order.discount}%` : "-"}</p>
                <p>Total: ${order.total}</p>
                <p>Dirección: {order.address}</p>
                
                {/* Payment status indicator */}
                <div className="flex items-center">
                  <p className="mr-2 text-gray-700">Estado de pago:</p>
                  {order.isPaid && order.paymentDate ? (
                    <div className="flex items-center">
                      <div className="px-4 py-1 text-sm font-medium rounded-full bg-green text-white">
                        Pago
                      </div>
                      <div className="ml-2 text-sm text-gray-600">
                        {formatTableDate(order.paymentDate)}
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPaymentDrawer(order);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={false}
                        readOnly
                        className="cursor-pointer h-4 w-4"
                      />
                      <span className="text-sm text-gray-600">Pendiente</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center mt-3">
                <button
                  className="px-3 py-1.5 bg-white border border-blue text-blue rounded-md hover:bg-blue hover:text-white transition-colors flex items-center justify-center mx-auto gap-1.5 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDrawerShow(order);
                  }}
                >
                  <MdOutlineRemoveRedEye size={16} />
                  <span>Detalles del pedido</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add pagination for mobile view */}
        {ordersDataProcessed && ordersDataProcessed.totalElements > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={page}
              onChangePage={onPageChange}
              totalItems={ordersDataProcessed?.totalElements ?? 0}
              filasPorPaginas={ordersDataProcessed?.size}
            />
          </div>
        )}
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

      <PaymentStatusDrawer
        isOpen={paymentDrawerIsOpen}
        onClose={closePaymentDrawer}
        order={orderToPay}
        refreshTable={() => queryClient.invalidateQueries({ queryKey: ['orders'] })}
      />

      <ToastContainer />
    </div>
  );
};
