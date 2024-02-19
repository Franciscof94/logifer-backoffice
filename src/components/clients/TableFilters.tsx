import { FC } from "react";
import { InputText } from "../customs/InputText";
import { Button } from "../customs/Button";
import { IClient, IClientsFilter } from "../../interfaces";
import { SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setFiltersClient } from "../../store/slices/filtersSlice";

interface Props {
  methods: any;
}

export const TableFilters: FC<Props> = ({ methods }) => {
  const dispatch = useDispatch();
  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<IClient> = (data) => {
    const newObj: IClientsFilter = {
      nameAndLastname: data.nameAndLastname,
      email: data.email,
      address: data.address,
    };
    dispatch(setFiltersClient(newObj));
  };

  const handleResetFilter = () => {
    reset();
    dispatch(setFiltersClient({ clientName: "", address: "", email: "" }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-grey-50 rounded">
        <div className="flex justify-evenly py-4">
          <InputText
            placeholder="Buscar por nombre"
            type="text"
            width="w-[325px]"
            name="nameAndLastname"
          />
          <InputText
            placeholder="Buscar por email"
            type="text"
            width="w-[325px]"
            name="email"
          />
          <InputText
            placeholder="Buscar por dirección"
            type="text"
            width="w-[325px]"
            name="address"
          />
          <Button
            color=""
            className="bg-[#818181]"
            height="45px"
            legend="Limpiar filtros"
            size="xl"
            weight="normal"
            width="140px"
            onClick={handleResetFilter}
          />
          <Button
            color="blue"
            height="45px"
            legend="Buscar"
            size="xl"
            weight="normal"
            width="140px"
          />
        </div>
      </div>
    </form>
  );
};
