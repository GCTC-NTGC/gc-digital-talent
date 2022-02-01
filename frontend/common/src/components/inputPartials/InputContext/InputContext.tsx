import React from "react";

export const InputContext: React.FC<{ isVisible: boolean; context: string }> =
  ({ context, isVisible }) => {
    return isVisible ? (
      <span
        data-h2-display="b(block)"
        data-h2-radius="b(s)"
        data-h2-bg-color="b(lightpurple[.1])"
        data-h2-padding="b(all, xs)"
        data-h2-font-color="b(lightpurple)"
        data-h2-font-size="b(caption)"
        role="alert"
      >
        {context}
      </span>
    ) : null;
  };

export default InputContext;
