import React from "react";
import get from "lodash/get";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { InputWrapper } from "../../inputPartials";

export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "capture" | "type"
  > {
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

export const Radio: React.FunctionComponent<RadioProps> = ({
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
        type="radio"
        {...rest}
      />
    </InputWrapper>
  );
};

export default Radio;
