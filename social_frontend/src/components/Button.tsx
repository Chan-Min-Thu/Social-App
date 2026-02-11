import type { FC, ReactElement } from "react";

type ButtonProp = {
  className?: string;
  content: string;
  children?: ReactElement;
  type?: "button" | "submit" | "reset";
  onClick?: (event: any) => void;
  disabled?: boolean;
};

const Button: FC<ButtonProp> = ({
  className,
  content,
  children,
  onClick,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      {content}
    </button>
  );
};

export default Button;
