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
  } = methods;

  const inputProps = type === "number" ? { min: 0, ...props } : props;

  return (
    <div className="flex flex-col">
      <input
        {...register(name ?? "")}
        {...inputProps}
        disabled={disabled}
        type={type}
        className={`${color ? color : ""} rounded-md h-11 px-3 ${disabled ? "bg-gray-200" : ""} ${
          width ?? ''
        }`}
        placeholder={placeholder}
      />
      <div className="mt-2">
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="text-[#ED4337] font-normal">{message}</p>
          )}
        />
      </div>
    </div>
  );
};
