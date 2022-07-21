import React from "react";

export interface InputErrorProps {
  isVisible: boolean;
  error: string;
}

const InputError: React.FC<InputErrorProps> = ({ error, isVisible }) => {
  return isVisible ? (
    <span
      data-h2-display="base(block)"
      data-h2-margin="base(x.25, 0, 0, 0)"
      data-h2-border="base(all, 1px, solid, dt-error.light)"
      data-h2-radius="base(input)"
      data-h2-background-color="base(dt-error.1)"
      data-h2-padding="base(x.75)"
      data-h2-color="base(dt-error)"
      data-h2-font-size="base(caption)"
      role="alert"
    >
      {error}
    </span>
  ) : null;
};

export default InputError;
