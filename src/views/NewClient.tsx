import { FormNewClient } from "../components/clients/FormNewClient";
import { FormProvider, useForm } from "react-hook-form";
import { IClient } from "../interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientSchema } from "../validationSchemas";
import { useState, useEffect } from "react";

export const NewClient = () => {
  const methods = useForm<IClient>({
    resolver: yupResolver(ClientSchema),
    mode: "onChange",
  });
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Efecto para actualizar el estado cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <FormProvider {...methods}>
      <div>
        <div className="flex justify-center">
          <div className={`${isMobile ? 'w-full' : 'w-[815px]'} flex items-baseline`}>
            <FormNewClient methods={methods} isMobile={isMobile} />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};