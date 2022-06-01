import React from "react";

export interface InputErrorProps {
  isVisible: boolean;
  error: string;
}

const InputError: React.FC<InputErrorProps> = ({ error, isVisible }) => {
  return isVisible ? (
    <span
      data-h2-display="b(block)"
      data-h2-radius="b(s)"
      data-h2-bg-color="b(red[.1])"
      data-h2-padding="b(all, xs)"
      data-h2-font-color="b(red)"
      data-h2-font-size="b(caption)"
      role="alert"
    >
      {error}
    </span>
  ) : null;
};

export default InputError;
