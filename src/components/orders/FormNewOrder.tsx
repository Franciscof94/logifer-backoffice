import { Link } from "react-router-dom";
import { Button } from "../customs/Button";
import { CustomSelect } from "../customs/CustomSelect";
import { InputText } from "../customs/InputText";
import { SubmitHandler } from "react-hook-form";
import { FC } from "react";
import {
  IClientsSelectOptions,
  IOrder,
  IProductsOptions,
  IUnitTypeOptions,
} from "../../interfaces";
import { useSelector } from "react-redux";

interface Props {
  methods: any;
  handleSetOrder: (data: IOrder) => void;
  products: IProductsOptions[];
  clients: IClientsSelectOptions[];
  unitTypeOptions: IUnitTypeOptions[];
  isSelectCountDisabled: boolean | undefined;
  stock: number;
}

export const FormNewOrder: FC<Props> = ({
  methods,
  handleSetOrder,
  products,
  unitTypeOptions,
  clients,
  isSelectCountDisabled,
  stock,
}) => {
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;
  const { addressAndClientNameDisabled } = useSelector(
    (state: any) => state.ordersData
  );
  const onSubmit: SubmitHandler<IOrder> = (data) => {
    console.log(data);
    handleSetOrder(data);
  };

  const clientsWithoutAddress = clients.map((client) => {
    const { address, ...clientWithoutAddress } = client;
    return clientWithoutAddress;
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-[815px]">
        <div className="flex gap-x-20">
          <div className="flex flex-col w-1/2 ">
            <label className="text-xl mb-1">
              Producto{" "}
              {stock === 0 && (
                <small className="text-danger font-medium px-2">
                  No hay stock para este producto
                </small>
              )}
            </label>
            <CustomSelect
              name="product"
              options={products}
              placeholder={"Seleccionar"}
            />
            <div className="flex mt-1">
              <p className="font-normal">No existe el producto?</p>
              <Link
                to={"/nuevo-producto"}
                className="font-semibold text-blue px-1"
              >
                Agregar
              </Link>
            </div>
          </div>
          <div className="flex justify-between w-1/2 ">
            <div className="flex flex-col min-w-44 max-w-44 w-full">
              <label className="text-xl mb-1">Tipo de unidad</label>
              <CustomSelect
                name="unitType"
                options={unitTypeOptions}
                placeholder={"Seleccionar"}
              />
            </div>
            <div className="flex flex-col min-w-44 max-w-44 w-full">
              <label className="text-xl mb-1">Cantidad</label>
              <InputText
                name="count"
                placeholder="Cantidad"
                type="number"
                step="0.01"
                disabled={isSelectCountDisabled}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-x-20 mt-10">
          <div className="flex flex-col w-1/2 ">
            <label className="text-xl mb-1">Cliente</label>
            <CustomSelect
              name="client"
              options={clientsWithoutAddress}
              placeholder={"Seleccionar"}
              isDisabled={addressAndClientNameDisabled}
            />
            <div className="flex mt-1">
              <p className="font-normal">No existe el cliente?</p>
              <Link
                to={"/nuevo-cliente"}
                className="font-semibold text-blue px-1"
              >
                Agregar
              </Link>
            </div>
          </div>
          <div className="flex flex-col w-1/2 ">
            <label className="text-xl mb-1">Dirección</label>
            <InputText
              name="address"
              placeholder="Dirección"
              type="text"
              disabled={addressAndClientNameDisabled ? true : false}
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button
            disabled={!isValid}
            legend="Agregar"
            size="xl"
            width="139px"
            height="36px"
            color={isValid ? "blue" : "grey-50"}
            weight="font-light"
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};
