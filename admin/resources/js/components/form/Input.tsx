import * as React from "react";
import get from "lodash/get";
import { RegisterOptions, useFormContext } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** Holds text for the label associated with the input element */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** Set of validation rules and error messages to impose on input. */
  rules?: RegisterOptions;
}

const Input: React.FunctionComponent<InputProps> = ({
  id,
  label,
  name,
  rules = {},
  type,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        {...register(name, rules)}
        type={type}
        aria-invalid={error ? "true" : "false"}
        {...rest}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  );
};

export default Input;
