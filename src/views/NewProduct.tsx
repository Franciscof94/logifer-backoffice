import { FormNewProduct } from "../components/products/FormNewProduct";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "../interfaces";
import { ProductSchema } from "../validationSchemas";
import { useIsMobile } from "../hooks/useIsMobile";

export const NewProduct = () => {
  const methods = useForm<IProduct>({
    resolver: yupResolver(ProductSchema),
    mode: "onChange",
  });
  
  const isMobile = useIsMobile(768);

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