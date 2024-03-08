import { useCallback, useEffect, useState } from "react";
import { Title } from "../components/Title";
import { TableFilters } from "../components/orders/TableFilters";
import { TableOrders } from "../components/orders/TableOrders";
import OrdersService from "../services/orders/ordersService";
import { FormProvider, useForm } from "react-hook-form";
import { IOrderFilter } from "../interfaces";
import { Data } from "../interfaces/Orders.interface";
import { useDispatch, useSelector } from "react-redux";
import { setLoadingOrdersTable } from "../store/slices/ordersSlice";
import { IPagination } from "../interfaces/Pagination.interface";

export const Orders = () => {
  const dispatch = useDispatch();
  const methods = useForm<IOrderFilter>();
  const [orders, setOrders] = useState<Data[] | undefined>();
  const [pagination, setPagination] = useState<IPagination>();

  const { filtersOrders: filters } = useSelector(
    (state: any) => state.filtersData
  );

  const fetchOrders = useCallback(
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

        const { data, ...pagination } = await OrdersService.getOrders({
          page,
          rows,
          filters: filteredFilters,
        });

        setOrders(data);
        setPagination(pagination);
      } catch (error: any) {
        console.log(error);
      } finally {
        dispatch(setLoadingOrdersTable(false));
      }
    },
    [filters, dispatch]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, filters]);

  return (
    <FormProvider {...methods}>
      <div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto my-8">
            <Title title="Pedidos" />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto">
            <TableFilters methods={methods} />
          </div>
        </div>
        <div className="flex justify-center items-center mt-12 mb-3">
          <div className="w-full max-w-[1300px] m-auto">
            <h2 className="font-normal text-3xl">Todos los pedidos</h2>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto">
            <TableOrders
              refreshTable={fetchOrders}
              orders={orders}
              pagination={pagination}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
