import * as React from "react";
import get from "lodash/get";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { InputWrapper } from "../../inputPartials";

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "capture" | "type"
  > {
  /** HTML id used to identify the element. */
  id: string;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** Holds text for the label associated with the input element */
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** Set of validation rules and error messages to impose on input. */
  rules?: RegisterOptions;
  /** Set the type of the input. */
  type: "text" | "number" | "email" | "tel" | "password" | "date" | "search";
  /** If input is not required, hide the 'Optional' label */
  hideOptional?: boolean;
  errorPosition?: "top" | "bottom";
}

const Input: React.FunctionComponent<InputProps> = ({
  id,
  context,
  label,
  name,
  rules = {},
  type,
  errorPosition = "bottom",
  hideOptional,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message;

  return (
    <div data-h2-margin="b(x1, 0)">
      <InputWrapper
        inputId={id}
        label={label}
        required={!!rules.required}
        context={context}
        error={error}
        hideOptional={hideOptional}
        errorPosition={errorPosition}
      >
        <input
          data-h2-padding="b(x.25, x.5)"
          data-h2-radius="b(input)"
          data-h2-border="b(all, 1px, solid, dt-gray)"
          style={{ width: "100%" }}
          id={id}
          {...register(name, rules)}
          type={type}
          aria-required={rules.required ? "true" : undefined}
          aria-invalid={error ? "true" : "false"}
          {...rest}
        />
      </InputWrapper>
    </div>
  );
};

export default Input;
