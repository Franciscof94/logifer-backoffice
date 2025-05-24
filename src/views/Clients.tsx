import { TableFilters } from "../components/clients/TableFilters";
import { TableClients } from "../components/clients/TableClients";
import { FormProvider, useForm } from "react-hook-form";
import { IClient } from "../interfaces";
import { useCallback, useEffect, useState } from "react";
import { setLoadingOrdersTable } from "../store/slices/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import ClientsService from "../services/clients/clientsServices";
import { IPagination } from "../interfaces/Pagination.interface";

export const Clients = () => {
  const dispatch = useDispatch();
  const methods = useForm<IClient>();
  const { filtersClients: filters } = useSelector(
    (state: any) => state.filtersData
  );

  const [clients, setClients] = useState<IClient[] | undefined>();
  const [pagination, setPagination] = useState<IPagination>();

  const fetchClients = useCallback(
    async (page = 1, rows = 9) => {
      try {
        const filteredFilters = Object.keys(filters).reduce(
          (acc: { [key: string]: string }, key) => {
            const value = filters[key];
            if (value !== "") {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );
        dispatch(setLoadingOrdersTable(true));

        const { data, ...pagination } = await ClientsService.getClients({
          page,
          rows,
          filters: filteredFilters,
        });
        dispatch(setLoadingOrdersTable(false));
        setClients(data);
        setPagination(pagination);
      } catch (error: any) {
        console.log(error);
      }
    },
    [filters, dispatch]
  );

  useEffect(() => {
    fetchClients();
  }, [fetchClients, filters]);

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-[1300px] m-auto">
          <FormProvider {...methods}>
            <TableFilters methods={methods} />
          </FormProvider>
        </div>
      </div>
      <div className="flex justify-center items-center mt-12 mb-3">
        <div className="w-full max-w-[1300px] m-auto">
          <h2 className="font-normal text-3xl">Todos los clientes</h2>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-[1300px] m-auto">
          <TableClients
            refreshTable={fetchClients}
            clients={clients}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};
