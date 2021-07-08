import React from "react";

const InputError: React.FC<{ isVisible: boolean; error: string }> = ({
  error,
  isVisible,
}) => {
  return isVisible ? (
    <p
      data-h2-display="b(inline-block)"
      data-h2-radius="b(s)"
      data-h2-bg-color="b(red[.1])"
      data-h2-padding="b(all, xs)"
      data-h2-color="b(red)"
      role="alert"
    >
      {error}
    </p>
  ) : null;
};

export default InputError;
