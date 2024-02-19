import { useDispatch, useSelector } from "react-redux";
import { CustomSelect } from "../customs/CustomSelect";
import { FC, useEffect } from "react";
import { fetchProductsOptions } from "../../store/slices/selectOptionsSlice";
import { AppDispatch } from "../../store/store";

interface Props {
  methods: any;
}

export const ProductsReportFilter: FC<Props> = ({ methods }) => {
  const { watch } = methods;
  const productValue = watch("productReport");

  const dispatch = useDispatch<AppDispatch>();
  const { productsOptions } = useSelector(
    (state: any) => state.selectOptionsData
  );

  const yearOptions = [];

  for (let i = 2024; i <= 2050; i++) {
    yearOptions.push({ value: i, label: `${i}` });
  }

  const months = [
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
  useEffect(() => {
    dispatch(fetchProductsOptions());
  }, [dispatch]);

  return (
    <div className=" flex justify-center gap-x-5">
      <div className="w-full max-w-[300px]">
        <CustomSelect
          name="productReport"
          options={productsOptions}
          placeholder="Seleccionar año"
        />
      </div>
      <div className="w-full max-w-[300px]">
        <CustomSelect
          name="yearReport"
          options={yearOptions}
          placeholder="Seleccionar año"
          isDisabled={!productValue ? true : false}
        />
      </div>
      <div className="w-full max-w-[300px]">
        <CustomSelect
          name="monthReport"
          options={monthOptions}
          placeholder="Seleccionar año"
          /* isDisabled={!productValue || !yearValue} */
        />
      </div>
    </div>
  );
};
