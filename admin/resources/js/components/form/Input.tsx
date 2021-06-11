import * as React from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The text for label associated with select input. */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
}

const Input: React.FunctionComponent<InputProps> = ({
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
  const error = errors[name]?.message;
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
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
