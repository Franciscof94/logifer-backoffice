import { FC } from "react";
import { InputText } from "../customs/InputText";
import { IClient } from "../../interfaces";

interface Props {
  methods: any;
  client: IClient | undefined;
  refreshTable: () => void;
  modalIsOpen: boolean;
}

export const FormEditClient: FC<Props> = () => {
  return (
    <div className="px-16 mt-3 mb-5">
      <div className="flex mt-8 gap-x-16">
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Nombre y apellido</label>
          <InputText
            placeholder="Nombre y apellido"
            type="text"
            color="bg-grey"
            name="nameAndLastname"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Email</label>
          <InputText
            placeholder="Email"
            type="text"
            color="bg-grey"
            name="email"
          />
        </div>
      </div>
      <div className="flex mt-8 gap-x-16">
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Dirección</label>
          <InputText
            placeholder="Dirección"
            type="text"
            color="bg-grey"
            name="address"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-xl mb-1">Teléfeno</label>
          <InputText
            placeholder="Teléfeno"
            type="text"
            color="bg-grey"
            name="phone"
          />
        </div>
      </div>
    </div>
  );
};
