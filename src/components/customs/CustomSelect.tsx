import { FC } from "react";
import AsyncSelect from "react-select/async";
import Select, { StylesConfig, SingleValue } from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

interface IOption {
  value: number | string | undefined;
  label: string;
}

interface Props {
  loadOptions?: () => Promise<IOption[]>;
  options: IOption[];
  placeholder: string;
  name: string;
  async?: boolean;
  value?: {
    value: number | string | null;
    label: string;
  };
  isDisabled?: boolean;
  className?: string;
}

export const CustomSelect: FC<Props> = ({
  async,
  name,
  className,
  ...props
}) => {
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

  const customStyles: StylesConfig<IOption, false> = {
    control: (provided) => ({
      ...provided,
      height: "44px",
      backgroundColor: "white",
      border: "none",
      borderRadius: "6px",
      "&:hover": {
        borderColor: "blue",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999
    })
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Component
            {...register(name ?? "")}
            {...field}
            {...props}
            onChange={(option: SingleValue<IOption>) => {
              field.onChange(option?.value);
            }}
            value={optionSelected ? options.find(option => option.value === optionSelected) : null}
            styles={customStyles}
            isSearchable={true}
            noOptionsMessage={() => "No hay opciones"}
            placeholder={props.placeholder}
            loadingMessage={() => "Cargando..."}
          />
        )}
      />

      {Object.keys(errors).length > 0 && (
        <div className="mt-2">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => <p>{message}</p>}
          />
        </div>
      )}
    </div>
  );
};
