import { Title } from "../components/Title";
import { FormNewProduct } from "../components/products/FormNewProduct";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "../interfaces";
import { ProductSchema } from "../validationSchemas";

export const NewProduct = () => {
  const methods = useForm<IProduct>({
    resolver: yupResolver(ProductSchema),
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto my-8">
            <Title title="Nuevo producto" />
          </div>
        </div>
        <div className="flex justify-center">
          <FormNewProduct methods={methods} />
        </div>
      </div>
    </FormProvider>
  );
};
