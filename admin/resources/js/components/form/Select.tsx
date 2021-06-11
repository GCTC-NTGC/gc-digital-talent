import * as React from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** The text for label associated with select input. */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options for the select element. */
  options: { value: string | number; text: string }[];
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
}

const Select: React.FunctionComponent<SelectProps> = ({
  label,
  name,
  options,
  rules,
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
      <select
        {...register(name, rules)}
        aria-invalid={error ? "true" : "false"}
        {...rest}
      >
        {options.map(({ value, text }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      {error && <span role="alert">{error}</span>}
    </div>
  );
};

export default Select;
