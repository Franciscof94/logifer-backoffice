import { FC, useEffect, useState } from "react";
import { IClientOrder, IOrderModal, Order } from "../../interfaces";
import { TiDelete } from "react-icons/ti";
import { DeleteProductModal } from "./DeleteProductModal";
import OrdersService from "../../services/orders/ordersService";
import { toast } from "react-toastify";
import { setLoadingButton } from "../../store/slices/uiSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../customs/DataTable";
import { FiMinus, FiPlus } from "react-icons/fi";
import { formatArgentinePrice } from "../../utils/formatters";

interface Props {
  orders: IOrderModal[] | undefined;
  refreshTable: () => void;
  closeModalOrderTable: () => void;
  clientOrder: IClientOrder | undefined;
}

export const TableOrdersInModal: FC<Props> = ({
  orders,
  refreshTable,
  closeModalOrderTable,
  clientOrder,
}) => {
  const dispatch = useDispatch();

  const [ordersTable, setOrdersTable] = useState<IOrderModal[] | undefined>([]);
  const [rowSelected, setRowSelected] = useState<Order>();
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loadingRows, setLoadingRows] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleDelete = async (
    orderId: string | undefined,
    productId: string | undefined
  ) => {
    try {
      dispatch(setLoadingButton(true));
      await OrdersService.deleteProductOrder(orderId, productId);
      dispatch(setLoadingButton(false));

      setOrdersTable((prevState: IOrderModal[] | undefined) => {
        const filterProductOrder = prevState?.filter(
          (productOrder) => productOrder.product.id !== productId
        );

        if (!filterProductOrder || filterProductOrder.length === 0) {
          refreshTable();
          closeModalOrderTable();
        }

        return filterProductOrder;
      });
      refreshTable();
    } catch (error) {
      dispatch(setLoadingButton(false));
    }
  };


  const handleUpdateQuantity = async (row: Order, increment: boolean) => {
    if (loadingRows[row.id || '']) {
      return;
    }
    
    try {
      setLoadingRows(prev => ({ ...prev, [row.id || '']: true }));
      
      const currentCount = row.count || 0;
      
      const fractionalUnitIds = ["5", "6", "7"];
      const unitTypeId = typeof row.product.unitType === 'object' && row.product.unitType !== null
        ? (row.product.unitType as {id: string}).id
        : typeof row.product.unitType === 'string'
          ? row.product.unitType
          : '';
          
      const isUnidadType = unitTypeId === "4";
      const isFractionalUnit = unitTypeId && fractionalUnitIds.includes(unitTypeId);
      
      const shouldUseSmallIncrements = isUnidadType || isFractionalUnit;
      
      const incrementAmount = shouldUseSmallIncrements ? 0.25 : 1;
      
      const minAmount = shouldUseSmallIncrements ? 0.25 : 1;
      
      const newCount = increment 
        ? currentCount + incrementAmount
        : Math.max(minAmount, currentCount - incrementAmount);
        
      const roundedCount = Math.round(newCount * 100) / 100;
      setOrdersTable((prevState: IOrderModal[] | undefined) => {
        return prevState?.map((item) => {
          if (item.id === row.id) {
            return {
              ...item,
              count: roundedCount,
            };
          }
          return item;
        });
      });


      await OrdersService.editProductCount({
        orderId: row.id,
        productId: row.product.id,
        count: roundedCount,
      });

      await refreshTable();
      toast.success("Cantidad actualizada");
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocurrió un error al actualizar la cantidad");
      }
      await refreshTable();
    } finally {
      setLoadingRows(prev => ({ ...prev, [row.id || '']: false }));
    }
  };

  const columns: ColumnDef<IOrderModal>[] = [
    {
      id: "product",
      header: "Producto",
      cell: ({ row }) => (
        <span className={`text-grey-70 ${isMobile ? "text-sm" : ""}`}>
          {row.original.product.name}
        </span>
      ),
    },
    {
      id: "unitType",
      header: "Tipo de unidad",
      cell: ({ row }) => (
        <span className={`text-grey-70 ${isMobile ? "text-sm" : ""}`}>
          {row.original.product.unitType || "-"}
        </span>
      ),
    },
    {
      id: "quantity",
      header: "Cantidad",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 py-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateQuantity(row.original, false);
            }}
            disabled={loadingRows[row.original.id || '']}
            className={`p-1.5 rounded-md ${loadingRows[row.original.id || ''] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3342B1]/5'} text-[#3342B1] transition-colors`}
          >
            <FiMinus size={16} />
          </button>
          <div className="text-gray-700 min-w-[40px] text-center flex items-center justify-center">
            {loadingRows[row.original.id || ''] ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            ) : (
              <>
                {row.original.count}
                {row.original.unit}
              </>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateQuantity(row.original, true);
            }}
            disabled={loadingRows[row.original.id || '']}
            className={`p-1.5 rounded-md ${loadingRows[row.original.id || ''] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3342B1]/5'} text-[#3342B1] transition-colors`}
          >
            <FiPlus size={16} />
          </button>
        </div>
      ),
    },
    {
      id: "price",
      header: "Precio por unidad",
      cell: ({ row }) => (
        <span className={`text-grey-70 ${isMobile ? "text-sm" : ""}`}>
          {formatArgentinePrice(row.original.price)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Acción</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <TiDelete
            color="#F44336"
            className="cursor-pointer"
            size={isMobile ? 20 : 24}
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
    <div className="w-full">
      <div className={`${isMobile ? "overflow-x-auto w-full" : ""}`}>
        <DataTable
          columns={columns}
          data={ordersTable || []}
          className="bg-white"
        />
      </div>

      <div className="flex justify-end items-center mt-4 w-full">
        <div className="flex items-center gap-3">
          {clientOrder?.discount ? (
            <div className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md font-medium">
              {clientOrder.discount}% descuento
            </div>
          ) : null}
          <div className="bg-gray-100 px-4 py-2 rounded-md shadow-sm border border-gray-200">
            <span className="font-medium text-gray-700">Total:</span>
            <span className="ml-2 font-bold text-gray-900">${clientOrder?.total}</span>
          </div>
        </div>
      </div>

      {/* Ya no necesitamos el modal de edición */}
      <DeleteProductModal
        closeModal={closeModalDelete}
        modalIsOpen={modalDeleteIsOpen}
        product={rowSelected?.product}
        orderId={rowSelected?.id}
        handleDelete={(id) => handleDelete(id, rowSelected?.product.id)}
      />
    </div>
  );
};
