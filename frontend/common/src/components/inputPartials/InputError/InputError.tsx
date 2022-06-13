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
      data-h2-background-color="b(dt-error.1)"
      data-h2-padding="b(x.25)"
      data-h2-color="b(dt-error)"
      data-h2-font-size="b(caption)"
      role="alert"
    >
      {error}
    </span>
  ) : null;
};

export default InputError;
