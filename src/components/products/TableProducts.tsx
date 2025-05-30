import { FC, useState, useEffect, useMemo } from "react";
import { IProduct } from "../../interfaces";
import ProductsService from "../../services/products/productsService";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../customs/DataTable";
import { EditProductDrawer } from "./EditProductDrawer";
import { DeleteProductDrawer } from "./DeleteProductDrawer";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setLoadingButton } from "../../store/slices/uiSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  formatArgentinePrice,
  formatArgentineNumber,
} from "../../utils/formatters";

interface Props {
  products: IProduct[];
  refreshTable: () => void;
  loadingTableOrders?: boolean;
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const TableProducts: FC<Props> = ({
  products,
  refreshTable,
  loadingTableOrders,
}) => {
  const [localProducts, setLocalProducts] = useState<IProduct[]>([]);
  const dispatch = useDispatch();

  const productsData = useMemo(() => products || [], [products]);

  useEffect(() => {
    if (productsData && productsData.length > 0) {
      setLocalProducts(productsData);
    }
  }, [productsData]);

  const [drawerDeleteIsOpen, setDrawerDeleteIsOpen] = useState(false);
  const [drawerEditIsOpen, setDrawerEditIsOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState<IProduct>();

  const [isDeleting, setIsDeleting] = useState(false);

  const openDrawerDelete = (row: IProduct) => {
    setRowSelected(row);
    setDrawerDeleteIsOpen(true);
  };

  const closeDrawerDelete = () => {
    setDrawerDeleteIsOpen(false);
  };

  const openDrawerEdit = (row: IProduct) => {
    setRowSelected(row);
    setDrawerEditIsOpen(true);
  };

  const closeDrawerEdit = () => {
    setDrawerEditIsOpen(false);
  };

  const handleDelete = async (id: number | undefined) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      dispatch(setLoadingButton(true));
      await ProductsService.deleteProduct(id);

      setLocalProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      closeDrawerDelete();

      refreshTable();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      dispatch(setLoadingButton(false));
    }
  };

  const columns: ColumnDef<IProduct>[] = [
    {
      id: "productName",
      header: "Nombre",
      accessorKey: "productName",
      cell: ({ row }) => <span>{row.original.productName}</span>,
    },
    {
      id: "price",
      header: "Precio",
      accessorKey: "price",
      cell: ({ row }) => (
        <span>{formatArgentinePrice(row.original.price)}</span>
      ),
    },
    {
      id: "stock",
      header: "Stock",
      accessorKey: "stock",
      cell: ({ row }) => (
        <span>{formatArgentineNumber(row.original.stock)}</span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right pr-6">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex justify-end pr-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
              <MoreVertical size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  openDrawerEdit(row.original);
                }}
              >
                <Edit size={16} />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2 text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  openDrawerDelete(row.original);
                }}
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="max-h-[380px] overflow-y-auto">
        <DataTable
          columns={columns}
          data={localProducts.length > 0 ? localProducts : productsData}
          isLoading={loadingTableOrders}
          className="bg-white"
        />
      </div>

      <DeleteProductDrawer
        onClose={closeDrawerDelete}
        isOpen={drawerDeleteIsOpen}
        product={rowSelected}
        handleDelete={handleDelete}
      />

      <EditProductDrawer
        onClose={closeDrawerEdit}
        isOpen={drawerEditIsOpen}
        product={rowSelected}
      />
    </div>
  );
};
