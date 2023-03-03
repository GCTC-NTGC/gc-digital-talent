import React from "react";

export interface InputContextProps {
  isVisible: boolean;
  context: string | React.ReactNode;
}

const InputContext: React.FC<InputContextProps> = ({ context, isVisible }) => {
  return isVisible ? (
    <span
      data-h2-display="base(block)"
      data-h2-margin="base(x.5, 0, 0, 0)"
      data-h2-border="base(1px solid primary.darker)"
      data-h2-radius="base(input)"
      data-h2-background-color="base(primary.lightest)"
      data-h2-padding="base(x.75)"
      data-h2-color="base(primary.darker)"
      data-h2-font-size="base(caption)"
    >
      {context}
    </span>
  ) : null;
};

export default InputContext;
