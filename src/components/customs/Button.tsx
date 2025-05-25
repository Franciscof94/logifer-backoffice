import { FC } from "react";

interface Props {
  legend?: string;
  width?: string;
  size: string;
  color: 'rojo' | 'verde' | 'blue' | 'grey-50';
  height: string;
  weight: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement> | undefined) => void;
  type?: "submit";
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button: FC<Props> = ({
  legend,
  width,
  color,
  height,
  weight,
  className,
  isLoading,
  disabled,
  children,
  ...props
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'rojo':
        return 'bg-danger hover:bg-danger/90 text-white';
      case 'verde':
        return 'bg-green hover:bg-green/90 text-white';
      case 'blue':
        return 'bg-blue hover:bg-blue/90 text-white';
      case 'grey-50':
        return 'bg-[#B8B8B8] hover:bg-[#a0a0a0] text-black';
      default:
        return 'bg-blue hover:bg-blue/90 text-white';
    }
  };

  const getTextSize = (size?: string | undefined) => {
    switch (size) {
      case 'xs': return 'text-xs';
      case 'sm': return 'text-sm';
      case 'base': return 'text-base';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      case '2xl': return 'text-2xl';
      default: return 'text-base';
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'normal': return 'font-normal';
      case 'medium': return 'font-medium';
      case 'semibold': return 'font-semibold';
      case 'bold': return 'font-bold';
      default: return 'font-medium';
    }
  };

  const colorClasses = getColorClasses();
  const textSizeClass = getTextSize();
  const fontWeightClass = getFontWeight();
  const baseClasses = `${fontWeightClass} ${textSizeClass} rounded-md`;
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${colorClasses} ${className || ''} ${disabledClasses}`.trim()}
      style={{ width: `${width}`, height: `${height}` }}
      {...props}
      disabled={disabled}
    >
      <div className="flex items-center justify-center">
        {isLoading && (
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 me-1 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        )}
        {!isLoading ? (
          children ? children : <span>{legend}</span>
        ) : (
          <span className="text-lg">Cargando..</span>
        )}
      </div>
    </button>
  );
};
