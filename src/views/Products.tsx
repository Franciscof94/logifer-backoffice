import { useCallback, useEffect, useState } from "react";
import { TableFilters } from "../components/products/TableFilters";
import { TableProducts } from "../components/products/TableProducts";
import { IProduct } from "../interfaces";
import { FormProvider, useForm } from "react-hook-form";
import { IPagination } from "../interfaces/Pagination.interface";
import { useDispatch, useSelector } from "react-redux";
import ProductsService from "../services/products/productsService";
import { setLoadingOrdersTable } from "../store/slices/ordersSlice";
import { setLoadingButton } from "../store/slices/uiSlice";
import { ToastContainer } from "react-toastify";
import { Pagination } from "../components/pagination/Pagination";

export const Products = () => {
  const dispatch = useDispatch();
  const methods = useForm<IProduct>();

  const [products, setProducts] = useState<IProduct[] | undefined>();
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { filtersProducts: filters } = useSelector(
    (state: { filtersData: { filtersProducts: Record<string, string> } }) => state.filtersData
  );

  const fetchProducts = useCallback(
    async (page: number = 1, size: number = 9) => {
      try {
        const filteredFilters = Object.keys(filters).reduce<Record<string, string>>(
          (acc, key) => {
            const value = filters[key];
            if (value !== "") {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );
        dispatch(setLoadingOrdersTable(true));
        dispatch(setLoadingButton(true));

        const { data, ...pagination } = await ProductsService.getProducts({
          page,
          size,
          filters: filteredFilters,
        });
        dispatch(setLoadingOrdersTable(false));
        dispatch(setLoadingButton(false));
        console.log('Fetched products:', data);
        console.log('Pagination:', pagination);
        setProducts(data);
        setPagination(pagination);
      } catch (error) {
        console.error('Error fetching products:', error);
        dispatch(setLoadingOrdersTable(false));
        dispatch(setLoadingButton(false));
      }
    },
    [filters, dispatch]
  );

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, filters, currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const loadingTableOrders = useSelector(
    (state: { ordersData: { loadingOrdersTable: boolean } }) => state.ordersData.loadingOrdersTable
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <FormProvider {...methods}>
      <div className="pt-8 pb-12"> {/* Added top and bottom padding */}
        <div className="flex justify-center items-center mb-8"> {/* Added margin bottom */}
          <div className={`w-full ${isMobile ? 'px-4' : 'max-w-[1300px]'} m-auto`}>
            <TableFilters methods={methods} />
          </div>
        </div>
        <div className="flex justify-center items-center mt-8 mb-6"> {/* Adjusted margins */}
          <div className={`w-full ${isMobile ? 'px-4' : 'max-w-[1300px]'} m-auto`}>
            <h2 className={`font-normal ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Todos los productos</h2>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className={`w-full ${isMobile ? 'px-4 overflow-x-auto' : 'max-w-[1300px]'} m-auto`}>
            <TableProducts
              products={products || []}
              pagination={pagination}
              refreshTable={() => fetchProducts(currentPage)}
              loadingTableOrders={loadingTableOrders}
            />
            {pagination && (
              <div className="mt-4 flex justify-end">
                <Pagination
                  currentPage={currentPage}
                  onChangePage={handlePageChange}
                  totalItems={pagination.totalElements || 0}
                  filasPorPaginas={pagination.size || 9}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </FormProvider>
  );
};
