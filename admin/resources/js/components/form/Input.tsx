import * as React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import errorMessages from "./errorMessages";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The error message displayed if the form validation fails. */
  errorMessage?: string;
  /** The text for label associated with select input. */
  label: string;
  /** This method allows you to register an input/select Ref and apply validation rules into React Hook Form. https://react-hook-form.com/api#register */
  register?: UseFormRegister<any>;
}

const Input: React.FunctionComponent<InputProps> = ({
  errorMessage,
  label,
  type,
  name,
  register,
  required,
}) => {
  const registerProps = register && name ? register(name) : {};
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        aria-invalid={errorMessage ? "true" : "false"}
        {...registerProps}
      />
      {errorMessage && <span role="alert">{errorMessage}</span>}
    </div>
  );
};

export default Input;
