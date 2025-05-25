import { FormNewProduct } from "../components/products/FormNewProduct";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "../interfaces";
import { ProductSchema } from "../validationSchemas";
import { useState, useEffect } from "react";

export const NewProduct = () => {
  const methods = useForm<IProduct>({
    resolver: yupResolver(ProductSchema),
    mode: "onChange",
  });
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
        <div className="flex justify-center pt-6 md:pt-10">
          <FormNewProduct methods={methods} isMobile={isMobile} />
        </div>
      </div>
    </FormProvider>
  );
};