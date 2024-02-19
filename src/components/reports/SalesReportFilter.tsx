import { FC, useEffect } from "react";
import { CustomSelect } from "../customs/CustomSelect";

interface Props {
  methods: any;
}

export const SalesReportFilter: FC<Props> = ({ methods }) => {
  const { setValue } = methods;
  const options = [];
  const currentYear = new Date().getFullYear();


  for (let i = 2024; i <= 2050; i++) {
    options.push({ value: i, label: `${i}` });
  }

  useEffect(() => {
    setValue("yearReport", currentYear);
  }, [setValue, currentYear]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[300px]">
        <CustomSelect
          name="yearReport"
          options={options}
          placeholder="Seleccionar año"
        />
      </div>
    </div>
  );
};
