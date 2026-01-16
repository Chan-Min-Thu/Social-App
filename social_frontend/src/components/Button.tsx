import type { FC } from "react";

type ButtonProp = {
  className?: string;
  content: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

const Button: FC<ButtonProp> = ({
  className,
  content,
  onClick,
  type = "button",
}) => {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
