import { FC } from "react";

interface Props {
  count: number | null | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputNumber: FC<Props> = ({
  count,
  handleChange,

}) => {
  return (
    <div className="flex justify-center my-2 ">
      <input
        type="text"
        className="h-8 max-w-16 text-center bg-grey rounded"
        value={count || 0}
        /* defaultValue={count || 0} */
        onChange={handleChange}
      />
    </div>
  );
};
