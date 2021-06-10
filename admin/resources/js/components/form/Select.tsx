import * as React from "react";
import { Control, useController } from "react-hook-form";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Object that connects controlled components to react hook form. */
  control: Control<any>;
  /** The text for label associated with select input. */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options for the select element. */
  options: { value: string | number; text: string }[];
  /** Object set of validation rules to impose on input. */
  rules?: { [key: string]: any };
  /** List of validation messages that correspond with the rules list. */
  ruleMessages?: { [key: string]: string };
}

const Select: React.FunctionComponent<SelectProps> = ({
  control,
  label,
  name,
  options,
  rules,
  ruleMessages,
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
      <select
        {...field}
        aria-invalid={fieldState.error ? "true" : "false"}
        {...rest}
      >
        {options.map(({ value, text }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      {fieldState.error?.type && ruleMessages && (
        <span role="alert">{ruleMessages[fieldState.error?.type]}</span>
      )}
    </div>
  );
};

export default Select;
