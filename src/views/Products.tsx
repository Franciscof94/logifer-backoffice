import { useCallback, useEffect, useState } from "react";
import { Title } from "../components/Title";
import { TableFilters } from "../components/products/TableFilters";
import { TableProducts } from "../components/products/TableProducts";
import { IProduct } from "../interfaces";
import { FormProvider, useForm } from "react-hook-form";
import { IPagination } from "../interfaces/Pagination.interface";
import { useDispatch, useSelector } from "react-redux";
import ProductsService from "../services/products/productsService";
import { setLoadingOrdersTable } from "../store/slices/ordersSlice";
import { ToastContainer } from "react-toastify";

export const Products = () => {
  const dispatch = useDispatch();
  const methods = useForm<IProduct>();

  const [products, setProducts] = useState<IProduct[] | undefined>();
  const [pagination, setPagination] = useState<IPagination>();

  const { filtersProducts: filters } = useSelector(
    (state: any) => state.filtersData
  );

  const fetchProducts = useCallback(
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

        const { data, ...pagination } = await ProductsService.getProducts({
          page,
          rows,
          filters: filteredFilters,
        });
        dispatch(setLoadingOrdersTable(false));
        setProducts(data);
        setPagination(pagination);
      } catch (error: any) {
        console.log(error);
      }
    },
    [filters, dispatch]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, filters]);

  return (
    <FormProvider {...methods}>
      <div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto my-8">
            <Title title="Productos" />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto">
            <TableFilters methods={methods} />
          </div>
        </div>
        <div className="flex justify-center items-center mt-12 mb-3">
          <div className="w-full max-w-[1300px] m-auto">
            <h2 className="font-normal text-3xl">Todos los productos</h2>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto">
            <TableProducts
              products={products}
              pagination={pagination}
              refreshTable={fetchProducts}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </FormProvider>
  );
};
