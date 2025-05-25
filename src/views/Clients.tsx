import { useCallback, useEffect, useState } from "react";
import { TableFilters } from "../components/clients/TableFilters";
import { TableClients } from "../components/clients/TableClients";
import { FormProvider, useForm } from "react-hook-form";
import { IClient } from "../interfaces";

export const Clients = () => {
  const methods = useForm<IClient>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
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
            <h2 className={`font-normal ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Todos los clientes</h2>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className={`w-full ${isMobile ? 'px-4 overflow-x-auto' : 'max-w-[1300px]'} m-auto`}>
            <TableClients
              page={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
