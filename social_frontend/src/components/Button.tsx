import type { FC } from "react";

type ButtonProp = {
  className?: string;
  content: string;
};

const Button: FC<ButtonProp> = ({ className, content }) => {
  return <button className={`btn ${className}`}>{content}</button>;
};

export default Button;
