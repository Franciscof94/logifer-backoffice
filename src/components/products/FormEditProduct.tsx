import { FC, useEffect, useState } from "react";
import { InputText } from "../customs/InputText";
import { IProduct } from "../../interfaces";
import { UseFormReturn } from "react-hook-form";

interface Props {
  methods: UseFormReturn<IProduct>;
}

export const FormEditProduct: FC<Props> = ({ methods }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { register } = methods;

  return (
    <div className="w-full">
      <div className={`${isMobile ? 'flex flex-col gap-y-6' : 'flex gap-x-16'}`}>
        <div className={`flex flex-col ${isMobile ? 'w-full' : 'flex-1'}`}>
          <label className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium text-gray-700 mb-2`}>Nombre del producto</label>
          <div className="relative rounded-md overflow-hidden bg-white shadow-sm">
            <InputText
              placeholder="Nombre del producto"
              type="text"
              className="w-full border-0 focus:ring-2 focus:ring-blue-500 h-11"
              {...register("productName")}
            />
          </div>
        </div>
      </div>
      <div className={`${isMobile ? 'flex flex-col gap-y-6' : 'flex gap-x-16'} mt-8`}>
        <div className={`flex flex-col ${isMobile ? 'w-full' : 'flex-1'}`}>
          <label className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium text-gray-700 mb-2`}>Precio</label>
          <div className="relative rounded-md overflow-hidden bg-white shadow-sm">
            <InputText
              placeholder="Precio"
              type="number"
              step="0.01"
              className="w-full border-0 focus:ring-2 focus:ring-blue-500 h-11"
              {...register("price")}
            />
          </div>
        </div>
        <div className={`flex flex-col ${isMobile ? 'w-full' : 'flex-1'}`}>
          <label className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium text-gray-700 mb-2`}>Stock</label>
          <div className="relative rounded-md overflow-hidden bg-white shadow-sm">
            <InputText 
              placeholder="Stock" 
              type="number" 
              step="0.01"
              className="w-full border-0 focus:ring-2 focus:ring-blue-500 h-11"
              {...register("stock")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
