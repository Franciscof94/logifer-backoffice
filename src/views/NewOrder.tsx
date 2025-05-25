import { useEffect, useState, useMemo } from "react";
import { FormNewOrder } from "../components/orders/FormNewOrder";
import { TableNewOrder } from "../components/orders/TableNewOrder";
import { FormProvider, useForm, Resolver } from "react-hook-form";
import { IOrder, IOrderTable } from "../interfaces";
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
import { setLoadingButton } from "../store/slices/uiSlice";
import {
  IProductOption,
  IUnitTypeOption,
  IClientOption,
} from "../interfaces/SelectOptions.interface";
import { useClients } from "../hooks/queries/useClients";
import { useProducts } from "../hooks/queries/useProducts";
import { useUnitTypes } from "../hooks/queries/useUnitTypes";
import { useCreateOrder } from "../hooks/mutations/useCreateOrder";
import { RootState } from "../store/store";
import { Card, CardContent } from "../components/ui/card";
import { DiscountSheet } from "../components/orders/DiscountSheet";

export const NewOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientName: clientNameStore } = useSelector(
    (state: RootState) => state.ordersData
  );
  const { isLoadingButton } = useSelector((state: RootState) => state.uiData);

  const [newOrders, setNewOrders] = useState<IOrderTable[]>([]);
  const [discountSheetOpen, setDiscountSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    data: clientsResponse = {
      data: [],
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 1,
    },
    isLoading: isLoadingClients,
    error: clientsError,
  } = useClients(1, 100);
  const {
    data: productsResponse = { items: [], meta: {} },
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts();
  const {
    data: unitTypeOptions = [],
    isLoading: isLoadingUnitTypes,
    error: unitTypesError,
  } = useUnitTypes();
  const createOrder = useCreateOrder();

  useEffect(() => {
    if (unitTypesError) {
      console.error("Error loading unit types:", unitTypesError);
      toast.error("Error al cargar los tipos de unidades");
    }
  }, [unitTypesError]);

  useEffect(() => {
    if (productsError) {
      console.error("Error loading products:", productsError);
      toast.error("Error al cargar los productos");
    }
  }, [productsError]);

  useEffect(() => {
    if (clientsError) {
      console.error("Error loading clients:", clientsError);
      toast.error("Error al cargar los clientes");
    }
  }, [clientsError]);

  const methods = useForm<IOrder>({
    resolver: yupResolver(OrderSchema) as unknown as Resolver<IOrder>,
    mode: "onChange",
  });

  const { watch, reset, setValue, trigger } = methods;

  const clientValue = watch("client");
  const productValue = watch("product");
  const unitTypeValue = watch("unitType");
  const discountValue = watch("discount");

  const findProduct = productsResponse.items.find(
    (product) => product.id === productValue
  ) as IProductOption | undefined;

  const clientOptions = useMemo(() => {
    return clientsResponse.data.map((client) => ({
      value: client.id?.toString() || '',
      label: client.nameAndLastname || '',
      address: client.address || ''
    })) as IClientOption[];
  }, [clientsResponse.data]);

  const findClient = clientOptions.find(
    (client) => client.value === clientValue
  );

  const findUnitType = unitTypeOptions?.find(
    (unitType: IUnitTypeOption) => unitType.value === unitTypeValue
  ) as IUnitTypeOption | undefined;

  const handleSetOrder = (order: IOrder) => {
    const productExists = newOrders.some(
      (existingOrder) => existingOrder.product.id === findProduct?.id
    );

    dispatch(setAddresAndClientNameDisabled(true));
    if (productExists) {
      toast.error("Este producto ya ha sido agregado!");
      reset({
        product: undefined,
        address: findClient?.address || "",
        count: undefined,
        client: clientValue,
      });
      return;
    }

    setNewOrders((prevOrders) => {
      if (!findProduct || !findClient) return prevOrders;

      const newOrder: IOrderTable = {
        id: findProduct.value,
        product: {
          name: findProduct.productName ?? "",
          id: findProduct.id ?? "",
        },
        address: order.address || "",
        discount: order.discount ? 1 : 0,
        client: {
          label: findClient.label,
          value: findClient.value,
        },
        price: findProduct.price,
        count: order.count || 0,
        unit: findProduct.unitType,
        unitType: findUnitType
          ? {
              id: findUnitType.value,
              label: findUnitType.label,
              equivalencyValue: findUnitType.equivalencyValue,
            }
          : undefined,
      };

      return [...prevOrders, newOrder];
    });

    reset({
      product: undefined,
      address: findClient?.address || "",
      count: undefined,
      client: clientValue,
    });
  };

  const handleDelete = (id: string | undefined) => {
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
      const firstOrder = newOrders[0];

      if (!firstOrder) {
        toast.error("No hay productos para crear el pedido.");
        return;
      }

      const subtotal = newOrders.reduce((sum, item) => {
        return sum + (item.price || 0) * (item.count || 0);
      }, 0);

      const total = discountValue
        ? subtotal * (1 - discountValue / 100)
        : subtotal;

      const payload = {
        clientId: firstOrder.client.value,
        address: firstOrder.address || "",
        orderDate: new Date().toISOString(),
        total,
        products: newOrders.map((item) => ({
          productId: item.product.id,
          count: item.count || 0,
          unitTypeId: item.unitType?.id || "",
          price: item.price,
        })),
        deliveryDate: null,
        discount: discountValue,
      };


      dispatch(setLoadingButton(true));
      await createOrder.mutateAsync(payload, {
        onSuccess: () => {
          toast.success("Pedido creado exitosamente");
          setTimeout(() => {
            navigate("/pedidos");
          }, 1000);
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Error al crear el pedido");
    } finally {
      dispatch(setLoadingButton(false));
    }
  };

  useEffect(() => {
    if (findClient) {
      setValue("address", findClient.address || "");
      dispatch(
        setClientName({
          clientName: {
            value: clientValue,
            label: findClient.label,
            address: findClient.address,
          },
        })
      );
      trigger("address");
    }
  }, [findClient, setValue, dispatch, trigger, clientValue]);

  useEffect(() => {
    if (findUnitType?.isSelectCountDisabled) {
      setValue("count", 1);
    } else {
      setValue("count", undefined);
    }
  }, [findUnitType?.isSelectCountDisabled, setValue]);

  return (
    <FormProvider {...methods}>
      <div className="h-full bg-gray-50 overflow-y-auto">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="space-y-6">
              <FormNewOrder
                methods={methods}
                handleSetOrder={handleSetOrder}
                clients={clientOptions}
                products={productsResponse.items}
                unitTypeOptions={unitTypeOptions}
                isSelectCountDisabled={findUnitType?.isSelectCountDisabled}
                stock={findProduct?.stock}
                isLoading={
                  isLoadingProducts || isLoadingUnitTypes || isLoadingClients
                }
              />

              {clientNameStore?.label && (
                <Card className="max-w-[815px] mx-auto shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Cliente:
                        </span>
                        <span className="ml-2 text-sm text-gray-900">
                          {clientNameStore.label}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Dirección:
                        </span>
                        <span className="ml-2 text-sm text-gray-900">
                          {clientNameStore.address || newOrders[0]?.address || ""}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <TableNewOrder
                data={newOrders}
                setNewOrders={setNewOrders}
                handleDelete={handleDelete}
              />

              <div className={`${isMobile ? 'flex flex-col' : 'flex justify-end items-center'} gap-4 max-w-[815px] mx-auto`}>
                <Button
                  color={newOrders.length === 0 ? "grey-50" : "verde"}
                  height="44px"
                  legend={
                    discountValue
                      ? `Descuento (${discountValue}%)`
                      : isMobile ? "Descuento" : "Aplicar descuento"
                  }
                  size="lg"
                  weight="normal"
                  disabled={newOrders.length === 0}
                  className={`${isMobile ? 'w-full' : 'px-6'} shadow-sm hover:opacity-90 transition-opacity`}
                  onClick={() => setDiscountSheetOpen(true)}
                />
                <Button
                  legend={isMobile ? "Guardar" : "Guardar Pedido"}
                  onClick={() => {
                    if (newOrders.length) {
                      handleSave();
                      dispatch(setAddresAndClientNameDisabled(false));
                    }
                  }}
                  isLoading={isLoadingButton || createOrder.isPending}
                  size="xl"
                  width={isMobile ? "100%" : "180px"}
                  height="44px"
                  disabled={
                    !newOrders.length ||
                    isLoadingButton ||
                    createOrder.isPending
                  }
                  color={newOrders.length ? "blue" : "grey-50"}
                  weight="normal"
                  className="shadow-sm hover:opacity-90 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <DiscountSheet
        open={discountSheetOpen}
        setOpen={setDiscountSheetOpen}
        height={30}
      />
    </FormProvider>
  );
};
