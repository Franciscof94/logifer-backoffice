import { FC, useState, useEffect } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputText } from "../customs/InputText";
import { IProduct, IProductsFilter } from "../../interfaces";
import { useDispatch, useSelector } from "react-redux";
import { setFiltersProducts } from "../../store/slices/filtersSlice";
import { RootState } from "../../store/store";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface Props {
  methods: UseFormReturn<IProduct>;
}

export const TableFilters: FC<Props> = ({ methods }) => {
  const dispatch = useDispatch();
  const { handleSubmit, reset } = methods;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSubmit: SubmitHandler<IProduct> = (data) => {
    const newObj: IProductsFilter = {
      product: data.productName || "",
      price: data.price ? String(data.price) : "",
    };
    dispatch(setFiltersProducts(newObj));
  };

  const handleResetFilter = () => {
    reset();
    dispatch(setFiltersProducts({ product: "", price: "", typeUnit: "" }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border border-gray-200 bg-gray-200 rounded-md">
        <CardContent className="p-6">
          <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid grid-cols-3 gap-6'}`}>
            <div className="space-y-2">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
              <div className="relative rounded-md overflow-hidden">
                <InputText
                  placeholder="Buscar por producto"
                  type="text"
                  width="w-full"
                  name="productName"
                  className="border-0 focus:ring-2 focus:ring-blue-500 h-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <div className="relative rounded-md overflow-hidden">
                <InputText
                  placeholder="Buscar por precio"
                  type="text"
                  width="w-full"
                  name="price"
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
                disabled={isLoadingButton}
              >
                Limpiar filtros
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-10 px-4 py-2 bg-blue text-white hover:bg-blue-700 rounded-md font-medium"
                disabled={isLoadingButton}
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
