import type { FC } from "react";

type ButtonProp = {
  className?: string;
  content: string;
  onClick?: () => void;
};

const Button: FC<ButtonProp> = ({ className, content, onClick }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
