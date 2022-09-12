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
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** Set of validation rules and error messages to impose on input. */
  rules?: RegisterOptions;
  /** Optional context which user can view by toggling a button. */
  context?: string;
}

const Radio: React.FunctionComponent<RadioProps> = ({
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
      data-h2-flex-direction="base(row)"
      data-h2-align-items="base(center)"
    >
      <input
        data-h2-order="base(-1)"
        data-h2-margin="base(0, x.25, 0, 0)"
        id={id}
        {...register(name, rules)}
        type="radio"
        {...rest}
      />
    </InputWrapper>
  );
};

export default Radio;
