import { object, string } from "yup";

export const ClientSchema = object({
  nameAndLastname: string()
    .required("El campo es obligatorio")
    .min(6, "El numero minimo de caracteres es 6"),
  address: string()
    .required("El campo es obligatorio")
    .min(3, "El numero minimo de caracteres es 3"),
  email: string()
    .email("El email no es valido")
    .optional(),
  phone: string()
    .min(6, "El numero minimo de caracteres es 6")
    .optional(),
});
