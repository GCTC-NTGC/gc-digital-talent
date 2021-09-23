import React from "react";
import get from "lodash/get";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { InputWrapper } from "../../inputPartials";

export interface CheckboxProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "capture" | "type"> {
  /** HTML id used to identify the element. */
  id: string;
  /** Holds text for the label associated with the input element */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** Set of validation rules and error messages to impose on input. */
  rules?: RegisterOptions;
  /** Optional context which user can view by toggling a button. */
  context?: string;
}

export const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  id,
  label,
  name,
  rules = {},
  context,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message;

  return (
    <div data-h2-margin="b(bottom, xxs)">
      <InputWrapper
        inputId={id}
        label={label}
        required={!!rules.required}
        context={context}
        error={error}
        hideOptional
      >
        <input
          style={{ order: -1 }}
          data-h2-margin="b(bottom-right, xxs)"
          id={id}
          {...register(name, rules)}
          type="checkbox"
          aria-invalid={error ? "true" : "false"}
          {...rest}
        />
      </InputWrapper>
    </div>
  );
};

export default Checkbox;
