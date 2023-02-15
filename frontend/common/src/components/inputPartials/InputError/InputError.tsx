import React from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export type InputFieldError =
  | string
  | FieldError
  // This is from `react-hook-form` so ignore the any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Merge<FieldError, FieldErrorsImpl<any>>
  | undefined;

export interface InputErrorProps extends React.HTMLProps<HTMLSpanElement> {
  error: InputFieldError;
  isVisible: boolean;
}

const InputError = ({ error, isVisible, ...rest }: InputErrorProps) => {
  return isVisible ? (
    <span
      role="alert"
      aria-live="polite"
      data-h2-display="base(block)"
      data-h2-margin="base(x.25, 0, 0, 0)"
      data-h2-border="base(1px solid error.darker)"
      data-h2-radius="base(input)"
      data-h2-background-color="base(error.lightest)"
      data-h2-padding="base(x.75)"
      data-h2-color="base(error.darker)"
      data-h2-font-size="base(caption)"
      {...rest}
    >
      {error?.toString()}
    </span>
  ) : null;
};

export default InputError;
