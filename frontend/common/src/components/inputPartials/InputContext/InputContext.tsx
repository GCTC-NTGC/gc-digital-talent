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
      data-h2-margin="base(x.25, 0, 0, 0)"
      data-h2-border="base(1px solid primary.light)"
      data-h2-radius="base(input)"
      data-h2-background-color="base(primary.10)"
      data-h2-padding="base(x.75)"
      data-h2-color="base(primary)"
      data-h2-font-size="base(caption)"
    >
      {context}
    </span>
  ) : null;
};

export default InputContext;
