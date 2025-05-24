import { number, object, string } from "yup";

export const OrderSchema = object({
  product: string().required("El campo es obligatorio"),
  client: string().required("El campo es obligatorio"),
  unitType: string().required("El campo es obligatorio"),
  unit: string().optional(),
  count: number()
    .nullable()
    .required("El campo es obligatorio"),
  address: string().required("El campo es obligatorio"),
  discount: number()
    .min(0, "El descuento no puede ser negativo")
    .max(100, "El descuento no puede ser mayor a 100%")
    .default(0),
});
