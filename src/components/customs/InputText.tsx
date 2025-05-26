import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  placeholder: string;
  type: string;
  width?: string;
  color?: string;
  name?: string;
  defaultValue?: string | undefined;
  value?: string | number | undefined;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  step?: string;
}

export const InputText: FC<Props> = ({
  placeholder,
  type,
  width,
  color,
  name = "",
  disabled,
  ...props
}) => {
  const methods = useFormContext();
  const {
    register,
    formState: { errors },
    setValue,
  } = methods;

  // Configuración especial para campos numéricos
  const inputProps = type === "number" ? { 
    min: 0, 
    ...props,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      // Manejo especial para fracciones comunes
      const value = e.target.value;
      if (value === "1/4") {
        setValue(name, 0.25, { shouldValidate: true });
        return;
      } else if (value === "1/2") {
        setValue(name, 0.5, { shouldValidate: true });
        return;
      } else if (value === "3/4") {
        setValue(name, 0.75, { shouldValidate: true });
        return;
      }
      
      // Para valores numéricos normales
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setValue(name, numValue, { shouldValidate: true });
      } else if (value === "") {
        // Si está vacío, establecemos null en lugar de NaN
        setValue(name, null, { shouldValidate: true });
      }
      
      // Llamar al onChange original si existe
      if (props.onChange) {
        props.onChange(e);
      }
    }
  } : props;

  return (
    <div className="flex flex-col">
      <input
        {...register(name ?? "")}
        {...inputProps}
        disabled={disabled}
        type={type}
        className={`${color ? color : ""} border border-white rounded-md h-11 px-3 ${
          disabled ? "bg-gray-200" : ""
        } ${width ?? ""}`}
        placeholder={placeholder}
      />
      {errors[name] && (
        <div className="mt-2">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-[#ED4337] font-normal">{message}</p>
            )}
          />
        </div>
      )}
    </div>
  );
};
