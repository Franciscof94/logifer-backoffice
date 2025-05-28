import { useCallback, useState } from "react";
import { TableFilters } from "../components/orders/TableFilters";
import { TableOrders } from "../components/orders/TableOrders";
import { FormProvider, useForm } from "react-hook-form";
import { IOrderFilter } from "../interfaces";
import { useIsMobile } from "../hooks/useIsMobile";

export const Orders = () => {
  const methods = useForm<IOrderFilter>();
  const isMobile = useIsMobile(768);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  return (
    <FormProvider {...methods}>
      <div className="pt-8 pb-12">
        {" "}
        {/* Added top and bottom padding */}
        <div className="flex justify-center items-center mb-8">
          {" "}
          {/* Added margin bottom */}
          <div
            className={`w-full ${isMobile ? "px-4" : "max-w-[1300px]"} m-auto`}
          >
            <TableFilters methods={methods} />
          </div>
        </div>
        <div className="flex justify-center items-center mt-8 mb-6">
          {" "}
          {/* Adjusted margins */}
          <div
            className={`w-full ${isMobile ? "px-4" : "max-w-[1300px]"} m-auto`}
          >
            <h2 className={`font-normal ${isMobile ? "text-2xl" : "text-3xl"}`}>
              Todos los pedidos
            </h2>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div
            className={`w-full ${
              isMobile ? "px-4 overflow-x-auto" : "max-w-[1300px]"
            } m-auto`}
          >
            <TableOrders page={currentPage} onPageChange={handlePageChange} />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
