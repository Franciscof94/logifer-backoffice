import { FC } from "react";

interface Props {
  title: string;
}

export const Title: FC<Props> = ({ title }) => {
  return (
    <h1 className="font-semibold text-3xl md:text-4xl text-center">{title}</h1>
  );
};
