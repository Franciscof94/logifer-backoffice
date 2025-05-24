import { InputText } from "../customs/InputText";
import { Button } from "../customs/Button";
import { FC, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { IOrderFilter } from "../../interfaces";
import { setFiltersOrder } from "../../store/slices/filtersSlice";
import { useDispatch } from "react-redux";

interface Props {
  methods: any;
}

export const TableFilters: FC<Props> = ({ methods }) => {
  const { handleSubmit, reset } = methods;
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Efecto para actualizar el estado cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSubmit: SubmitHandler<IOrderFilter> = (data) => {
    const newObj: IOrderFilter = {
      nameAndLastname: data.nameAndLastname,
      orderDate: data.orderDate,
      address: data.address,
    };
    dispatch(setFiltersOrder(newObj));
  };

  const handleResetFilter = () => {
    reset();
    dispatch(setFiltersOrder({ clientName: "", address: "", orderDate: "" }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-grey-50 rounded">
        <div className={`${isMobile ? 'flex flex-col space-y-4 p-4' : 'flex justify-evenly py-4'}`}>
          <InputText
            placeholder="Buscar por cliente"
            type="text"
            width={isMobile ? "w-full" : "w-[325px]"}
            name="nameAndLastname"
          />
          <InputText
            placeholder="Buscar por fecha de creación"
            type="date"
            width={isMobile ? "w-full" : "w-[325px]"}
            name="orderDate"
          />
          <InputText
            placeholder="Buscar por dirección"
            type="text"
            width={isMobile ? "w-full" : "w-[325px]"}
            name="address"
          />
          <div className={`${isMobile ? 'flex justify-between gap-2' : ''}`}>
            <Button
              color="grey-50"
              className="bg-[#818181]"
              height="45px"
              legend="Limpiar filtros"
              size="xl"
              weight="normal"
              width={isMobile ? "100%" : "140px"}
              onClick={handleResetFilter}
            />
            <Button
              color="blue"
              height="45px"
              legend="Buscar"
              size="xl"
              weight="normal"
              width={isMobile ? "100%" : "140px"}
            />
          </div>
        </div>
      </div>
    </form>
  );
};