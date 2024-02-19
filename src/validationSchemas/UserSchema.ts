import { object, string } from "yup";

export const UserSchema = object({
  email: string().email().required("El campo es obligatorio"),
  password: string()
    .required("El campo es obligatorio")
    .min(6, "El número mínimo de caracteres es 6")
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{6,}$/,
      "La contraseña debe contener al menos una mayúscula, un carácter especial y un número"
    ),
});
