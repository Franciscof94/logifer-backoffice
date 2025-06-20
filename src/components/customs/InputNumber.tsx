import { FC } from "react";

interface Props {
  count: number | null | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
}

export const InputNumber: FC<Props> = ({ count, handleChange, ...props }) => {
  const displayValue = count === null || count === undefined ? "" : count;
  
  return (
    <div className="flex justify-center my-2 ">
      <input
        {...props}
        type="number"
        className="h-8 max-w-16 text-center bg-grey rounded"
        value={displayValue}
        onChange={handleChange}
      />
    </div>
  );
};