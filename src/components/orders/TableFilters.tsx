import { FC } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IOrderFilter } from "../../interfaces";
import { setFiltersOrder } from "../../store/slices/filtersSlice";
import { useDispatch } from "react-redux";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { InputText } from "../customs/InputText";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  methods: UseFormReturn<IOrderFilter>;
}

export const TableFilters: FC<Props> = ({ methods }) => {
  const { handleSubmit, reset } = methods;
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);

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
      <Card className="border border-gray-200 bg-gray-200 rounded-md">
        <CardContent className="p-6">
          <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid grid-cols-4 gap-6'}`}>
            <div className="space-y-2">
              <label htmlFor="nameAndLastname" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <div className="relative rounded-md overflow-hidden">
                <InputText
                  placeholder="Buscar por cliente"
                  type="text"
                  width="w-full"
                  name="nameAndLastname"
                  className="border-0 focus:ring-2 focus:ring-blue-500 h-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de creación</label>
              <div className="relative rounded-md overflow-hidden">
                <InputText
                  placeholder="Seleccionar fecha"
                  type="date"
                  width="w-full"
                  name="orderDate"
                  className="border-0 focus:ring-2 focus:ring-blue-500 h-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <div className="relative rounded-md overflow-hidden">
                <InputText
                  placeholder="Buscar por dirección"
                  type="text"
                  width="w-full"
                  name="address"
                  className="border-0 focus:ring-2 focus:ring-blue-500 h-10"
                />
              </div>
            </div>
            
            <div className={`${isMobile ? 'flex justify-between gap-4' : 'flex items-end gap-4'}`}>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                onClick={handleResetFilter}
              >
                Limpiar filtros
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-10 px-4 py-2 bg-blue text-white hover:bg-blue-700 rounded-md font-medium"
              >
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};