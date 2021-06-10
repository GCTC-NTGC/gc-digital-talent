import * as React from "react";
import { UseFormRegister } from "react-hook-form";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** The error message displayed if the form validation fails. */
  errorMessage?: string;
  /** The text for label associated with select input. */
  label: string;
  /** This method allows you to register an input/select Ref and apply validation rules into React Hook Form. https://react-hook-form.com/api#register */
  register?: UseFormRegister<any>;
  /** List of options for the select element. */
  options: { value: string | number; text: string }[];
}

const Select: React.FunctionComponent<SelectProps> = ({
  errorMessage,
  label,
  name,
  register,
  options,
  ...rest
}) => {
  const registerProps = register && name ? register(name) : {};
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <select {...registerProps} {...rest}>
        {options.map(({ value, text }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      {errorMessage && <span role="alert">{errorMessage}</span>}
    </>
  );
};

export default Select;
