import { FC, useState, useEffect, useMemo } from "react";
import { Pagination } from "../pagination/Pagination";
import { IClient } from "../../interfaces";
import ClientsService from "../../services/clients/clientsServices";
import { ToastContainer } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../customs/DataTable";
import { useClients } from "../../hooks/queries/useClients";
import { EditClientDrawer } from "./EditClientDrawer";
import { DeleteClientDrawer } from "./DeleteClientDrawer";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setLoadingButton } from "../../store/slices/uiSlice";
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

export const TableClients: FC<Props> = ({
  page,
  onPageChange,
}) => {
  const { data, isLoading, refetch } = useClients(page, 9);
  const dispatch = useDispatch();
  
  const [localClients, setLocalClients] = useState<IClient[]>([]);
  
  const clients = useMemo(() => data?.data ? data.data : [], [data]);
  const pagination = useMemo(() => data ? {
    page: data.page || 0,
    size: data.size || 9,
    totalElements: data.totalElements || 0,
    totalPages: data.totalPages || 0
  } : undefined, [data]);
  
  useEffect(() => {
    if (clients && clients.length > 0) {
      setLocalClients(clients);
    }
  }, [clients]);
  const [drawerDeleteIsOpen, setDrawerDeleteIsOpen] = useState(false);
  const [drawerEditIsOpen, setDrawerEditIsOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState<IClient>();

  const openDrawerDelete = (row: IClient) => {
    setRowSelected(row);
    setDrawerDeleteIsOpen(true);
  };

  const closeDrawerDelete = () => {
    setDrawerDeleteIsOpen(false);
  };

  const openDrawerEdit = (row: IClient) => {
    setRowSelected(row);
    setDrawerEditIsOpen(true);
  };

  const closeDrawerEdit = () => {
    setDrawerEditIsOpen(false);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: number | undefined) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      dispatch(setLoadingButton(true));
      await ClientsService.deleteClient(id);
      
      setLocalClients(prevClients => prevClients.filter(client => client.id !== id));
      
      closeDrawerDelete();
      
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      dispatch(setLoadingButton(false));
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
        <div className="flex justify-center">
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
      <div className="max-h-[380px]">
        <DataTable
          columns={columns}
          data={localClients.length > 0 ? localClients : clients}
          isLoading={isLoading}
          className="bg-white"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={pagination?.page ?? 0}
          onChangePage={(newPage) => onPageChange(newPage)}
          totalItems={pagination?.totalElements ?? 0}
          filasPorPaginas={pagination?.size}
        />
      </div>

      <DeleteClientDrawer
        onClose={closeDrawerDelete}
        isOpen={drawerDeleteIsOpen}
        client={rowSelected}
        handleDelete={handleDelete}
      />

      <EditClientDrawer
        onClose={closeDrawerEdit}
        isOpen={drawerEditIsOpen}
        client={rowSelected}
        refreshTable={() => onPageChange(page)}
      />

      <ToastContainer />
    </div>
  );
};
