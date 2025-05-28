import { useState } from "react";
import { Button } from "../components/customs/Button";
import { ProductsReports } from "../components/reports/ProductsReports";
import { SalesReports } from "../components/reports/SalesReports";
import { useIsMobile } from "../hooks/useIsMobile";

export const Reports = () => {
  const [reportIs, setReportIs] = useState<"sales" | "products">("sales");
  const isMobile = useIsMobile(768);
  
  return (
    <div>
      <div className="flex justify-center items-center px-4 sm:px-0">
        <div className="w-full max-w-[1300px] m-auto my-3">
          <div className={`${isMobile ? 'flex flex-col gap-y-2' : 'flex justify-center gap-x-2.5'}`}>
            <Button
              color={reportIs === "sales" ? "blue" : "grey-50"}
              height="40px"
              legend={isMobile ? "Ventas" : "Reportes por ventas"}
              size="xl"
              weight=""
              width={isMobile ? "100%" : "250px"}
              onClick={() => {
                setReportIs("sales");
              }}
            />
            <Button
              color={reportIs === "products" ? "blue" : "grey-50"}
              height="40px"
              legend={isMobile ? "Productos" : "Reportes por productos"}
              size="xl"
              weight=""
              width={isMobile ? "100%" : "250px"}
              onClick={() => {
                setReportIs("products");
              }}
            />
          </div>
        </div>
      </div>
      {reportIs === "sales" ? (
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto px-2 sm:px-4">
            <SalesReports />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto px-2 sm:px-4">
            <ProductsReports />
          </div>
        </div>
      )}
    </div>
  );
};
