import { number, object, string } from "yup";

export const ProductSchema = object({
  product: string()
    .required("El campo es obligatorio")
    .min(3, "El número mínimo de caracteres es 3"),
  stock: number()
    .required("El campo es obligatorio")
    .typeError("El precio debe ser un número"),
  price: number()
    .required("El campo es obligatorio")
    .typeError("El precio debe ser un número"),
});
