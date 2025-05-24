import { useState } from "react";
import { Button } from "../components/customs/Button";
import { ProductsReports } from "../components/reports/ProductsReports";
import { SalesReports } from "../components/reports/SalesReports";

export const Reports = () => {
  const [reportIs, setReportIs] = useState<"sales" | "products">("sales");

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-[1300px] m-auto my-3 flex justify-center gap-x-2.5">
          <div>
            <Button
              color={reportIs === "sales" ? "blue" : "grey-50"}
              height="40px"
              legend="Reportes por ventas"
              size="xl"
              weight=""
              width="250px"
              onClick={() => {
                setReportIs("sales");
              }}
            />
          </div>
          <div>
            <Button
              color={reportIs === "products" ? "blue" : "grey-50"}
              height="40px"
              legend="Reportes por productos"
              size="xl"
              weight=""
              width="250px"
              onClick={() => {
                setReportIs("products");
              }}
            />
          </div>
        </div>
      </div>
      {reportIs === "sales" ? (
        <div className="flex justify-center items-center ">
          <div className="w-full max-w-[1300px] m-auto  ">
            <SalesReports />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto">
            <ProductsReports />
          </div>
        </div>
      )}
    </div>
  );
};
