import { FC } from "react";

interface Props {
  title: string;
}

export const Title: FC<Props> = ({ title }) => {
  return <h1 className="text-[40px] text-black font-medium">{title}</h1>;
};
