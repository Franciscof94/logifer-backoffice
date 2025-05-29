import { CustomSelect } from "../customs/CustomSelect";
import { FC, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { IProductsReportFilter } from "../../interfaces/SalesReport.interface";
import { useProductOptions } from "../../hooks/queries/useProductOptions";
import { IProductOption } from "../../interfaces/SelectOptions.interface";

interface Props {
  methods: UseFormReturn<IProductsReportFilter>;
}

export const ProductsReportFilter: FC<Props> = ({ methods }) => {
  const { watch } = methods;
  const productValue = watch("productReport");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { data: productsOptions = { items: [], meta: {} } } = useProductOptions();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const yearOptions = [];

  for (let i = 2024; i <= 2050; i++) {
    yearOptions.push({ value: i, label: `${i}` });
  }

  const months = isMobile ? [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ] : [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const monthOptions = months.map((month, index) => ({
    value: String(index + 1).padStart(2, "0"),
    label: month,
  }));

  return (
    <div className={`${isMobile ? 'flex flex-col gap-y-4 px-2 mb-6' : 'flex justify-center gap-x-5'}`}>
      <div className={`w-full ${isMobile ? '' : 'max-w-[300px]'}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isMobile ? 'Producto' : 'Seleccionar producto'}
        </label>
        <CustomSelect
          name="productReport"
          options={productsOptions.items.map((product: IProductOption) => ({
            value: product.id,
            label: product.productName ?? '',
          }))}
          placeholder="Seleccionar producto"
        />
      </div>
      <div className={`w-full ${isMobile ? '' : 'max-w-[300px]'}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isMobile ? 'Año' : 'Seleccionar año'}
        </label>
        <CustomSelect
          name="yearReport"
          options={yearOptions}
          placeholder="Seleccionar año"
          isDisabled={!productValue}
        />
      </div>
      <div className={`w-full ${isMobile ? '' : 'max-w-[300px]'}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isMobile ? 'Mes' : 'Seleccionar mes'}
        </label>
        <CustomSelect
          name="monthReport"
          options={monthOptions}
          placeholder="Seleccionar mes"
          /* isDisabled={!productValue || !yearValue} */
        />
      </div>
    </div>
  );
};
