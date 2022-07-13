import React from "react";

export interface InputErrorProps {
  isVisible: boolean;
  error: string;
}

const InputError: React.FC<InputErrorProps> = ({ error, isVisible }) => {
  return isVisible ? (
    <span
      data-h2-display="base(block)"
      data-h2-radius="base(s)"
      data-h2-background-color="base(dt-error.1)"
      data-h2-padding="base(x.25)"
      data-h2-color="base(dt-error)"
      data-h2-font-size="base(caption)"
      role="alert"
    >
      {error}
    </span>
  ) : null;
};

export default InputError;
