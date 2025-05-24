import React, { FC, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TiDelete } from "react-icons/ti";
import { FiMinus, FiPlus } from "react-icons/fi";
import { DeleteProductModal } from "./DeleteProductModal";
import { IOrderTable } from "../../interfaces";
import { useFormContext } from "react-hook-form";
import { Button } from "../customs/Button";
import { DiscountSheet } from "./DiscountSheet";
import { DataTable } from "../customs/DataTable";

interface Props {
  data: IOrderTable[];
  setNewOrders: React.Dispatch<React.SetStateAction<IOrderTable[]>>;
  handleDelete: (id: string | undefined) => void;
}

export const TableNewOrder: FC<Props> = ({
  data,
  setNewOrders,
  handleDelete,
}) => {
  const [modalDeleteIsOpen, setIsOpenModalDelete] = useState(false);
  const [discountSheetOpen, setDiscountSheetOpen] = useState(false);
  const [arrayProducts, setArrayProducts] = useState<IOrderTable[]>([]);
  const [rowSelected, setRowSelected] = useState<IOrderTable>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { watch } = useFormContext();
  const discountValue = watch("discount");

  const openModalDelete = (row: IOrderTable) => {
    setIsOpenModalDelete(true);
    setRowSelected(row);
  };

  const closeModalDelete = () => {
    setIsOpenModalDelete(false);
  };

  useEffect(() => {
    setArrayProducts(data);
  }, [data]);

  const handleUpdateQuantity = (row: IOrderTable, increment: boolean) => {
    setNewOrders((prevState: IOrderTable[]) => {
      return prevState.map((product) => {
        if (product.product.id === row.product.id) {
          const currentCount = product.count || 0;
          
          const fractionalUnitIds = ["5", "6", "7"];
          const isUnidadType = product.unitType?.id === "4";
          const isFractionalUnit = product.unitType && fractionalUnitIds.includes(product.unitType.id);
          
          const incrementAmount = isUnidadType 
            ? 0.25 
            : isFractionalUnit && product.unitType
              ? product.unitType.equivalencyValue 
              : 1;

          const minAmount = isUnidadType ? 0.25 : incrementAmount;

          const newCount = increment 
            ? currentCount + incrementAmount
            : Math.max(minAmount, currentCount - incrementAmount);
            
          const roundedCount = Math.round(newCount * 100) / 100;
          
          return {
            ...product,
            count: roundedCount,
          };
        }
        return product;
      });
    });
  };

  const total = data?.reduce((acc: number, row: IOrderTable) => {
    const price = parseFloat(row.price.toString().replace("$", ""));
    if (row.count) {
      let subtotal = price * row.count;
      if (discountValue) {
        subtotal *= (100 - discountValue) / 100;
      }
      return acc + subtotal;
    }
    return acc;
  }, 0);

  const totalConDescuento = discountValue
    ? total * ((100 - discountValue) / 100)
    : total;
  const montoDescuento = discountValue ? total * (discountValue / 100) : 0;

  const columns: ColumnDef<IOrderTable>[] = [
    {
      id: "product",
      header: "Producto",
      cell: ({ row }) => (
        <div className="py-2">
          <span className={`text-gray-700 ${isMobile ? "text-sm" : "text-base"}`}>
            {row.original.product.name}
          </span>
        </div>
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
            className="p-1.5 rounded-md hover:bg-[#3342B1]/5 text-[#3342B1] transition-colors"
          >
            <FiMinus size={16} />
          </button>
          <div
            className={`text-gray-700 min-w-[40px] text-center ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {row.original.count}
            {row.original.unit}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateQuantity(row.original, true);
            }}
            className="p-1.5 rounded-md hover:bg-[#3342B1]/5 text-[#3342B1] transition-colors"
          >
            <FiPlus size={16} />
          </button>
        </div>
      ),
    },
    {
      id: "action",
      header: () => <div className="text-center">Acción</div>,
      cell: ({ row }) => (
        <div className="flex justify-center py-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModalDelete(row.original);
            }}
            className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
          >
            <TiDelete size={isMobile ? 20 : 24} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={`${isMobile ? "w-full" : "mx-auto w-[815px]"}`}>
      <div className="">
        <div className="overflow-auto max-h-[400px] scrollbar">
          <DataTable
            columns={columns}
            data={arrayProducts}
            noDataMessage="No hay productos agregados"
            className="bg-white"
          />
        </div>

        <div className="mt-4">
          <div className="bg-[#3342B1] rounded-md p-4 text-white">
            <div className="flex justify-between items-start">
              <p className={`${isMobile ? "text-lg" : "text-xl"} font-medium text-white`}>
                Total:
              </p>
              <div className="flex flex-col items-end">
                {discountValue > 0 && (
                  <>
                    <span className={`${isMobile ? "text-sm" : "text-base"} text-white/80`}>
                      ${total.toFixed(1)}
                    </span>
                    <div className="flex items-center text-emerald-300">
                      <span className={`${isMobile ? "text-xs" : "text-sm"} mr-1`}>
                        Descuento ({discountValue}%):
                      </span>
                      <span className={`${isMobile ? "text-xs" : "text-sm"}`}>
                        -${montoDescuento.toFixed(1)}
                      </span>
                    </div>
                  </>
                )}
                <span className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold mt-1`}>
                  ${totalConDescuento.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteProductModal
        closeModal={closeModalDelete}
        modalIsOpen={modalDeleteIsOpen}
        orderId={rowSelected?.id}
        product={rowSelected?.product}
        handleDelete={handleDelete}
      />
      <DiscountSheet
        open={discountSheetOpen}
        setOpen={setDiscountSheetOpen}
        height={30}
      />
    </div>
  );
};
