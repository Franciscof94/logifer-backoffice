import { FC } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

interface IOption {
  value: number | string | undefined;
  label: string;
}

interface Props {
  loadOptions?: () => Promise<any>;
  options: IOption[];
  placeholder: string;
  name: string;
  async?: boolean;
  value?: {
    value: number | string | null;
    label: string;
  };
  isDisabled?: boolean;
}

export const CustomSelect: FC<Props> = ({ async, name, ...props }) => {
  const { options } = props;

  const Component = async ? AsyncSelect : Select;

  const methods = useFormContext();
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = methods;
  const optionSelected = watch(name);
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      height: "44px",
      backgroundColor: "white",
      border: "none",
      borderRadius: "6px",
      boxShadow:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      "&:hover": {
        borderColor: "blue",
      },
    }),
  };

  return (
    <div className="flex flex-col">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Component
            {...register(name ?? "")}
            {...field}
            {...props}
            onChange={(e: any) => {
              field.onChange(e.value);
            }}
            value={{
              value: optionSelected,
              label:
                options.find((option) => option.value === optionSelected)
                  ?.label ?? "Seleccionar",
            }}
            styles={customStyles}
          />
        )}
      />

      <div className="mt-2">
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => <p>{message}</p>}
        />
      </div>
    </div>
  );
};
