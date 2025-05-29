import { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "../customs/Button";
import { CustomSelect } from "../customs/CustomSelect";
import { InputText } from "../customs/InputText";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { IOrder } from "../../interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  IClientOption,
  IProductOption,
  IUnitTypeOption,
} from "../../interfaces/SelectOptions.interface";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  methods: UseFormReturn<IOrder>;
  handleSetOrder: (data: IOrder) => void;
  products: IProductOption[];
  clients: IClientOption[];
  unitTypeOptions: IUnitTypeOption[];
  isSelectCountDisabled: boolean | undefined;
  stock: number | undefined;
  isLoading?: boolean;
}

export const FormNewOrder: FC<Props> = ({
  methods,
  handleSetOrder,
  products,
  unitTypeOptions,
  clients,
  isSelectCountDisabled,
  stock,
  isLoading = false,
}) => {
  const {
    handleSubmit,
    formState: { isValid },
    watch
  } = methods;

  const { addressAndClientNameDisabled } = useSelector(
    (state: RootState) => state.ordersData
  );

  const onSubmit: SubmitHandler<IOrder> = (data) => {
    handleSetOrder(data);
  };

  const clientsWithoutAddress = clients.map(
    ({ address: _, ...clientWithoutAddress }) => clientWithoutAddress
  );

  const isMobile = useIsMobile(768);

  const product = watch("product");
  const client = watch("client");
  const unitType = watch("unitType");
  const count = watch("count");
  const address = watch("address");

  const allFieldsFilled = product && client && unitType && count && address;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className={`${isMobile ? "w-full" : "mx-auto w-[815px]"}`}>
        <div
          className={`${isMobile ? "flex flex-col gap-y-6" : "flex gap-x-20"}`}
        >
          <div className={`flex flex-col ${isMobile ? "w-full" : "w-1/2"}`}>
            <label className={`${isMobile ? "text-lg" : "text-xl"} mb-1`}>
              Producto{" "}
              {stock === 0 && (
                <small className="text-danger font-medium px-2">
                  No hay stock para este producto
                </small>
              )}
            </label>
            <CustomSelect
              name="product"
              options={products.map((product) => ({
                value: product.id,
                label: product.productName ?? "",
              }))}
              placeholder={isLoading ? "Cargando..." : "Seleccionar"}
              className="w-full"
              isDisabled={isLoading}
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
          <div
            className={`${
              isMobile ? "flex flex-col gap-y-6" : "flex justify-between w-1/2"
            }`}
          >
            <div className={`flex flex-col ${isMobile ? "w-full" : "w-[48%]"}`}>
              <label className={`${isMobile ? "text-lg" : "text-xl"} mb-1`}>
                Tipo de unidad
              </label>
              <CustomSelect
                name="unitType"
                options={unitTypeOptions}
                placeholder={isLoading ? "Cargando..." : "Seleccionar"}
                className="w-full"
                isDisabled={isLoading}
              />
            </div>
            <div className={`flex flex-col ${isMobile ? "w-full" : "w-[48%]"}`}>
              <label className={`${isMobile ? "text-lg" : "text-xl"} mb-1`}>
                Cantidad
              </label>
              <InputText
                name="count"
                placeholder="Cantidad"
                type="number"
                step="0.01"
                disabled={isSelectCountDisabled || isLoading}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div
          className={`${
            isMobile ? "flex flex-col gap-y-6 mt-6" : "flex gap-x-20 mt-10"
          }`}
        >
          <div className={`flex flex-col ${isMobile ? "w-full" : "w-1/2"}`}>
            <label className={`${isMobile ? "text-lg" : "text-xl"} mb-1`}>
              Cliente
            </label>
            <CustomSelect
              name="client"
              options={clientsWithoutAddress}
              placeholder={isLoading ? "Cargando..." : "Seleccionar"}
              isDisabled={addressAndClientNameDisabled || isLoading}
              className="w-full"
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
          <div className={`flex flex-col ${isMobile ? "w-full" : "w-1/2"}`}>
            <label className={`${isMobile ? "text-lg" : "text-xl"} mb-1`}>
              Dirección
            </label>
            <InputText
              name="address"
              placeholder="Dirección"
              type="text"
              disabled={addressAndClientNameDisabled || isLoading}
              className={`w-full ${addressAndClientNameDisabled ? 'bg-gray-200 text-gray-700 border-gray-300' : ''}`}
            />
          </div>
        </div>

        <div
          className={`flex ${
            isMobile ? "justify-center mt-6" : "justify-end mt-8"
          }`}
        >
          <Button
            disabled={!allFieldsFilled || !isValid || isLoading}
            legend="Agregar"
            size={isMobile ? "lg" : "xl"}
            width={isMobile ? "100%" : "139px"}
            height="36px"
            color={allFieldsFilled && isValid && !isLoading ? "blue" : "grey-50"}
            weight="font-light"
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};
