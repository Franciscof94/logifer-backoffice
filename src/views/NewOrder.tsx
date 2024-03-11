import { useEffect, useState } from "react";
import { FormNewOrder } from "../components/orders/FormNewOrder";
import { TableNewOrder } from "../components/orders/TableNewOrder";
import { Title } from "../components";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { IOrder, IOrderTable, IUnitTypeOptions } from "../interfaces";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { OrderSchema } from "../validationSchemas";
import { Button } from "../components/customs/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddresAndClientNameDisabled,
  setClientName,
} from "../store/slices/ordersSlice";
import { useNavigate } from "react-router-dom";
import OrdersService from "../services/orders/ordersService";
import {
  fetchClientsOptions,
  fetchProductsOptions,
  fetchUnitTypeOptions,
} from "../store/slices/selectOptionsSlice";
import { AppDispatch } from "../store/store";
import { AxiosError } from "axios";
import { setLoadingButton } from "../store/slices/uiSlice";

export const NewOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { clientName: clientNameStore } = useSelector(
    (state: any) => state.ordersData
  );
  const { clientOptions, productsOptions, unitTypeOptions } = useSelector(
    (state: any) => state.selectOptionsData
  );

  const { isLoadingButton } = useSelector((state: any) => state.uiData);

  const [newOrders, setNewOrders] = useState<IOrderTable[]>([]);

  const methods = useForm<IOrder>({
    resolver: yupResolver(OrderSchema) as Resolver<IOrder>,
    mode: "onChange",
  });

  const { watch, reset, setValue, trigger } = methods;

  const clientValue = watch("client");
  const productValue = watch("product");
  const unitTypeValue = watch("unitType");
  const discountValue = watch("discount");

  const findProduct = productsOptions.find(
    (product: { value: number; label: string }) =>
      product.value === productValue
  );
  const findClient = clientOptions?.find(
    (client: { value: number; label: string }) => client.value === clientValue
  );

  const findUnitType: IUnitTypeOptions = unitTypeOptions?.find(
    (unitType: { value: number; label: string }) =>
      unitType.value === unitTypeValue
  );

  const handleSetOrder = (order: IOrder) => {
    const productExists = newOrders.some(
      (existingOrder) => existingOrder.id === findProduct?.value
    );

    dispatch(setAddresAndClientNameDisabled(true));
    if (productExists) {
      toast.error("Este producto ya ha sido agregado!");
      reset({
        product: undefined,
        address: findClient.address,
        count: null,
        client: clientValue,
      });
      return;
    }

    setNewOrders((prevOrders) => {
      const newOrder: IOrderTable = {
        id: findProduct?.value,
        product: {
          name: findProduct?.label ?? "",
          id: findProduct?.value ?? undefined,
        },

        address: order.address,
        client: {
          label: findClient?.label ?? "",
          value: findClient?.value ?? undefined,
        },
        price: findProduct.price,
        unit: findProduct?.unitType,
        count: (order?.count ?? 0) * (findUnitType?.equivalencyValue ?? 0),
      };

      return [...prevOrders, newOrder];
    });

    reset({
      product: undefined,
      address: findClient.address,
      count: null,
      client: clientValue,
    });
  };

  const handleDelete = (id: number | undefined) => {
    setNewOrders((prevState: IOrderTable[]) => {
      const productDeleted = prevState.filter((ctPrev) => ctPrev.id !== id);

      if (!productDeleted.length) {
        dispatch(setAddresAndClientNameDisabled(false));
      }

      return productDeleted;
    });
  };

  const handleSave = async () => {
    try {
      const orders = newOrders.map((ctOrder) => {
        const { client, price, product, id, ...orderWithoutClient } = ctOrder;
        return {
          ...orderWithoutClient,
          discount: discountValue,
          clientId: ctOrder.client.value,
          productId: ctOrder.product.id,
        };
      });
      dispatch(setLoadingButton(true));
      await OrdersService.postNewOrder(orders);
      toast.success("Pedido creado correctamente!");
      setTimeout(() => {
        navigate("/pedidos");
      }, 1000);
    } catch (error: Error | AxiosError | any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocurrió un error al procesar la solicitud");
      }
    } finally {
      dispatch(setLoadingButton(false));
    }
  };

  useEffect(() => {
    dispatch(fetchClientsOptions());
    dispatch(fetchProductsOptions());
    dispatch(fetchUnitTypeOptions());
  }, [dispatch]);

  useEffect(() => {
    if (findClient) {
      setValue("address", findClient.address);
      dispatch(
        setClientName({
          clientName: findClient,
        })
      );
      trigger("address");
    }
  }, [findClient, setValue, dispatch, trigger]);

  useEffect(() => {
    if (findUnitType?.isSelectCountDisabled) {
      setValue("count", 1);
    } else {
      setValue("count", null);
    }
  }, [findUnitType?.isSelectCountDisabled, setValue]);

  return (
    <FormProvider {...methods}>
      <div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-[1300px] m-auto my-8">
            <Title title="Nuevo pedido" />
          </div>
        </div>
        <div className="flex justify-center">
          <FormNewOrder
            methods={methods}
            handleSetOrder={handleSetOrder}
            clients={clientOptions}
            products={productsOptions}
            unitTypeOptions={unitTypeOptions}
            isSelectCountDisabled={findUnitType?.isSelectCountDisabled}
            stock={findProduct?.stock}
          />
        </div>

        <div className="flex justify-center">
          <div className="w-[815px] flex items-end">
            <p className="text-3xl font-medium">Cliente:</p>
            <p className="text-xl px-2">{clientNameStore?.label}</p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <TableNewOrder
            data={newOrders}
            setNewOrders={setNewOrders}
            handleDelete={handleDelete}
          />
        </div>
        <div className="flex justify-center">
          <div className="w-[815px] flex items-baseline my-5 justify-end">
            {" "}
            <Button
              legend="Guardar"
              onClick={() => {
                if (newOrders.length) {
                  handleSave();
                  dispatch(setAddresAndClientNameDisabled(false));
                }
              }}
              isLoading={isLoadingButton}
              size="xl"
              width="139px"
              height="36px"
              disabled={newOrders.length && !isLoadingButton ? false : true}
              color={newOrders.length ? "blue" : "grey-50"}
              weight="font-light"
              type="submit"
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </FormProvider>
  );
};
