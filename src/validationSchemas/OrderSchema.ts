import { number, object, string } from "yup";

export const OrderSchema = object({
  product: string().required("El campo es obligatorio"),
  client: string().required("El campo es obligatorio"),
  unitType: string().required("El campo es obligatorio"),
  unit: string().optional(),
  count: number()
    .nullable()
    .transform((value) => {
      // Transformar valores vacíos o no numéricos a null en lugar de NaN
      return isNaN(value) ? null : value;
    })
    .required("El campo es obligatorio")
    .typeError("La cantidad debe ser un número válido"),
  address: string().required("El campo es obligatorio"),
  discount: number()
    .min(0, "El descuento no puede ser negativo")
    .max(100, "El descuento no puede ser mayor a 100%")
    .default(0)
    .nullable()
    .transform((value) => isNaN(value) ? 0 : value),
});
