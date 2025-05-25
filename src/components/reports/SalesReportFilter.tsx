import { FC, useEffect, useState } from "react";
import { CustomSelect } from "../customs/CustomSelect";

import { UseFormReturn } from "react-hook-form";
import { ISalesReportFilter } from "../../interfaces/SalesReport.interface";

interface Props {
  methods: UseFormReturn<ISalesReportFilter>;
}

export const SalesReportFilter: FC<Props> = ({ methods }) => {
  const { setValue } = methods;
  const options = [];
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  for (let i = 2024; i <= 2050; i++) {
    options.push({ value: i, label: `${i}` });
  }

  useEffect(() => {
    setValue("yearReport", currentYear);
  }, [setValue, currentYear]);

  return (
    <div className="flex justify-center mb-4">
      <div className={`w-full ${isMobile ? 'px-2' : 'max-w-[300px]'}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isMobile ? 'Año' : 'Seleccionar año de reporte'}
        </label>
        <CustomSelect
          name="yearReport"
          options={options}
          placeholder="Seleccionar año"
        />
      </div>
    </div>
  );
};
