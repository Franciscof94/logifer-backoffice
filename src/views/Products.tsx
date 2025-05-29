import { useState } from "react";
import { TableFilters } from "../components/products/TableFilters";
import { TableProducts } from "../components/products/TableProducts";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { Pagination } from "../components/pagination/Pagination";
import { useIsMobile } from "../hooks/useIsMobile";
import { useProducts } from "../hooks/queries/useProducts";
import { IProduct } from "../interfaces";

export const Products = () => {
  const methods = useForm<IProduct>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isMobile = useIsMobile(768);

  // Use the custom hook for products
  const { 
    data: productsData, 
    isLoading: isLoadingProducts,
  } = useProducts(currentPage);

  // Derived states from productsData
  const products = productsData?.data || [];
  const pagination = productsData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <FormProvider {...methods}>
      <div className="pt-8 pb-12">
        <div className="flex justify-center items-center mb-8">
          <div className={`w-full ${isMobile ? 'px-4' : 'max-w-[1300px]'} m-auto`}>
            <TableFilters methods={methods} />
          </div>
        </div>
        <div className="flex justify-center items-center mt-8 mb-6">
          <div className={`w-full ${isMobile ? 'px-4' : 'max-w-[1300px]'} m-auto`}>
            <h2 className={`font-normal ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Todos los productos</h2>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className={`w-full ${isMobile ? 'px-4 overflow-x-auto' : 'max-w-[1300px]'} m-auto`}>
            <TableProducts
              products={products}
              pagination={pagination}
              refreshTable={() => {}}
              loadingTableOrders={isLoadingProducts}
            />
            {pagination && pagination.totalElements > 0 && (
              <div className={`mt-4 ${isMobile ? 'flex justify-center w-full' : 'flex justify-end'}`}>
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
