import { number, object, string } from "yup";

export const ProductSchema = object({
  product: string()
    .required("El campo es obligatorio")
    .min(3, "El numero minimo de caracteres es 3"),
  stock: number().required("El campo es obligatorio"),
  price: number().required("El campo es obligatorio"),
});
