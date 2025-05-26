import { object, string } from "yup";

export const ClientSchema = object({
  nameAndLastname: string()
    .required("El campo es obligatorio"),
  address: string()
    .required("El campo es obligatorio"),
  email: string()
    .email("El email no es valido")
    .optional(),
  phone: string()
    .optional(),
});
