import { FC, useState, useRef, useEffect, useMemo } from "react";
import { TiDelete } from "react-icons/ti";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Pagination } from "../pagination/Pagination";
import { Data, IClientOrder } from "../../interfaces";
import { CheckOrderModal } from "./CheckOrderModal";
import { ColumnDef } from "@tanstack/react-table";
import { useOrders } from "../../hooks/queries/useOrders";
import { DataTable } from "../customs/DataTable";
import { formatTableDate } from "../../utils/dateUtils";
import { ShowOrderDrawer } from "./ShowOrderDrawer";
import OrdersService from "../../services/orders/ordersService";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  page: number;
  onPageChange: (page: number) => void;
}

export const TableOrders: FC<Props> = ({ page, onPageChange }) => {
  const queryClient = useQueryClient();
  const [drawerShowIsOpen, setIsOpenDrawerShow] = useState(false);
  const [modalCheckOrderIsOpen, setIsOpenModalCheckOrder] = useState(false);
  const [clientSelected, setClientSelected] = useState<IClientOrder>();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckOrder = async (e: React.MouseEvent, order: Data) => {
    e.stopPropagation();
    
    if (order.id) {
      setActiveOrderId(order.id);
      setShowCalendar(true);
    }
  };
  
  const handleDateSelect = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    
    const adjustedDate = new Date(year, month - 1, day, 12, 0, 0);
    
    setSelectedDate(adjustedDate);
  };
  
  const handleConfirmSend = async () => {
    if (activeOrderId && selectedDate) {
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        await OrdersService.markAsSent({
          orderId: activeOrderId,
          deliveryDate: formattedDate
        });
        
        toast.success('Pedido marcado como enviado');
        
        await queryClient.invalidateQueries({ queryKey: ['orders'] });
        await queryClient.refetchQueries({ queryKey: ['orders'] });
        
        setShowCalendar(false);
        setActiveOrderId(null);
        setSelectedDate(null);
        
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        toast.error('Error al marcar el pedido como enviado');
        console.error(error);
      }
    } else {
      toast.error('Selecciona una fecha de envío');
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
                {showCalendar && activeOrderId === row.original.id && (
                  <div 
                    ref={calendarRef}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCalendar(false);
                    }}
                  >
                    <div 
                      className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mb-4 font-medium text-xl text-gray-800">Selecciona fecha de envío:</div>
                      <input 
                        type="date" 
                        className="w-full p-3 border border-gray-300 rounded-md text-base"
                        value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleDateSelect(e.target.value);
                          }
                        }}
                        autoFocus
                      />
                      
                      {selectedDate && (
                        <div className="mt-3 text-sm text-gray-600 font-medium">
                          Fecha seleccionada: {format(selectedDate, 'dd/MM/yyyy')}
                        </div>
                      )}
                      
                      <div className="mt-6 flex justify-between w-full">
                        <button 
                          className="px-5 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 font-medium"
                          onClick={() => {
                            setShowCalendar(false);
                            setSelectedDate(null);
                          }}
                        >
                          Cancelar
                        </button>
                        
                        <button 
                          className="px-5 py-2 bg-blue rounded-md cursor-pointer text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
                          onClick={handleConfirmSend}
                          disabled={!selectedDate}
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }
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
        
        <ToastContainer />
        
        {/* Lista de tarjetas con espacio entre ellas */}
        <div className="flex flex-col space-y-4 px-4">
          {ordersDataProcessed?.data?.map((order: Data) => (
            <div
              key={order.id}
              className="rounded-md border border-gray-200 p-4 space-y-2 shadow-sm bg-white"
            >
            <div className="flex justify-between items-center">
              <span className="font-bold">Cliente: {order.client}</span>
              <div>
                {order.send ? (
                  <div className="bg-green-500 rounded-full p-1.5 flex items-center justify-center">
                    <FaCheck className="text-white" size={14} />
                  </div>
                ) : (
                  <div className="relative">
                    <TiDelete
                      onClick={(e) => handleCheckOrder(e, order)}
                      color="#F44336"
                      size={24}
                      className="cursor-pointer"
                    />
                    {showCalendar && activeOrderId === order.id && (
                      <div 
                        ref={calendarRef}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOrderId(null);
                        }}
                      >
                        <div 
                          className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="mb-4 font-medium text-xl text-gray-800">Selecciona fecha de envío:</div>
                          <input 
                            type="date" 
                            className="w-full p-3 border border-gray-300 rounded-md text-base"
                            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                            onChange={(e) => {
                              if (e.target.value) {
                                handleDateSelect(e.target.value);
                              }
                            }}
                            autoFocus
                          />
                          
                          {selectedDate && (
                            <div className="mt-3 text-sm text-gray-600 font-medium">
                              Fecha seleccionada: {format(selectedDate, 'dd/MM/yyyy')}
                            </div>
                          )}
                          
                          <div className="mt-6 flex justify-between w-full">
                            <button 
                              className="px-5 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 font-medium"
                              onClick={() => {
                                setShowCalendar(false);
                                setSelectedDate(null);
                              }}
                            >
                              Cancelar
                            </button>
                            
                            <button 
                              className="px-5 py-2 bg-blue cursor-pointer rounded-md text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
                              onClick={handleConfirmSend}
                              disabled={!selectedDate}
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="space-y-2">
              <p>
                Fecha creación:{" "}
                {formatTableDate(order.orderDate)}
              </p>
              <p>Fecha entrega: {formatTableDate(order.deliveryDate)}</p>
              <p>Descuento: {order.discount}%</p>
              <p>Total: ${order.total}</p>
              <p>Dirección: {order.address}</p>
            </div>
            <div className="text-center mt-2">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => openDrawerShow(order)}
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

      <ToastContainer />
    </div>
  );
};
