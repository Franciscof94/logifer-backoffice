import { number, object, string, boolean } from "yup";

export const OrderSchema = object({
  product: number().required("El campo es obligatorio"),
  client: number().required("El campo es obligatorio"),
  unitType: number().required("El campo es obligatorio"),
  unit: string().optional(),
  count: number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("El campo es obligatorio"),
  address: string().required("El campo es obligatorio"),
  discount: boolean(),
});
