import React from "react";

export interface InputContextProps {
  isVisible: boolean;
  context: string;
}

export const InputContext: React.FC<InputContextProps> = ({
  context,
  isVisible,
}) => {
  return isVisible ? (
    <span
      data-h2-display="b(block)"
      data-h2-radius="b(s)"
      data-h2-background-color="b(dt-primary.1)"
      data-h2-padding="b(x.5)"
      data-h2-color="b(dt-primary)"
      data-h2-font-size="b(caption)"
      role="alert"
    >
      {context}
    </span>
  ) : null;
};

export default InputContext;
