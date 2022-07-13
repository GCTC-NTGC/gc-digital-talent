import React from "react";

export interface InputContextProps {
  isVisible: boolean;
  context: string | React.ReactNode;
}

export const InputContext: React.FC<InputContextProps> = ({
  context,
  isVisible,
}) => {
  return isVisible ? (
    <span
      data-h2-display="base(block)"
      data-h2-radius="base(s)"
      data-h2-background-color="base(dt-primary.1)"
      data-h2-padding="base(x.5)"
      data-h2-color="base(dt-primary)"
      data-h2-font-size="base(caption)"
      role="alert"
    >
      {context}
    </span>
  ) : null;
};

export default InputContext;
