import { FC } from "react";

interface Props {
  legend: string;
  width: string;
  size: string;
  color: string;
  height: string;
  weight: string;
  onClick?: (e?: any) => void;
  type?: "submit";
  disabled?: boolean;
  className?: string;
}

export const Button: FC<Props> = ({
  legend,
  width,
  size,
  color,
  height,
  weight,
  className,
  ...props
}) => {
  return (
    <button
      className={`bg-${color} text-white font-${weight} rounded-md text-${size} ${className}`}
      style={{ width: `${width}`, height: `${height}` }}
      {...props}
    >
      {legend}
    </button>
  );
};
