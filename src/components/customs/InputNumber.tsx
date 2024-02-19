import { FC } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

interface Props {
  count: number | null | undefined;
  handleMinus: () => void;
  handlePlus: () => void;
}

export const InputNumber: FC<Props> = ({ count, handleMinus, handlePlus }) => {
  return (
    <div className="flex justify-center my-2">
      <div className="bg-[#C67070] w-8 h-8 flex justify-center items-center cursor-pointer rounded-tl rounded-bl">
        <FaMinus
          color="white"
          size={26}
          onClick={handleMinus}
        />
      </div>
      <div className="h-8 min-w-16 text-center bg-grey">{count}</div>
      <div className="bg-[#92BD8B] w-8 h-8 flex justify-center items-center cursor-pointer rounded-tr rounded-br">
        <FaPlus
          color="white"
          size={26}
          onClick={handlePlus}
        />
      </div>
    </div>
  );
};
