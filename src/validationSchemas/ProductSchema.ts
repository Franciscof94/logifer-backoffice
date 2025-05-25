import { number, object, string } from "yup";

export const ProductSchema = object({
  productName: string()
    .required("El campo es obligatorio")
    .min(3, "El número mínimo de caracteres es 3"),
  stock: number()
    .required("El campo es obligatorio")
    .typeError("El stock debe ser un número")
    .test('is-decimal', 'El stock debe ser un número válido', value => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d+)?$/.test(String(value));
    }),
  price: number()
    .required("El campo es obligatorio")
    .typeError("El precio debe ser un número"),
});
