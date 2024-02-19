import { Title } from "../components/Title";
import { FormNewClient } from "../components/clients/FormNewClient";
import { FormProvider, useForm } from "react-hook-form";
import { IClient } from "../interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClientSchema } from "../validationSchemas";

export const NewClient = () => {
  const methods = useForm<IClient>({
    resolver: yupResolver(ClientSchema),
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto my-8">
            <Title title="Nuevo cliente" />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-[815px] flex items-baseline">
            <FormNewClient methods={methods} />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
