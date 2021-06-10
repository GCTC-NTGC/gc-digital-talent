import * as React from "react";
import { Control, useController } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Object that connects controlled components to react hook form. */
  control: Control<any>;
  /** The text for label associated with select input. */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** Object set of validation rules to impose on input. */
  rules?: { [key: string]: any };
  /** List of validation messages that correspond with the rules list. */
  ruleMessages?: { [key: string]: string };
}

const Input: React.FunctionComponent<InputProps> = ({
  control,
  label,
  name,
  rules = {},
  ruleMessages,
  type,
  ...rest
}) => {
  const { field, fieldState } = useController({
    control,
    name,
    rules,
  });

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        {...field}
        type={type}
        aria-invalid={fieldState.error ? "true" : "false"}
        {...rest}
      />
      {fieldState.error?.type && ruleMessages && (
        <span role="alert">{ruleMessages[fieldState.error?.type]}</span>
      )}
    </div>
  );
};

export default Input;
