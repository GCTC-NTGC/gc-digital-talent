import * as React from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import ReactSelect from "react-select";

export type Option = { value: string | number; label: string };
interface MultiSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** The text for the label associated with the select input. */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options for the select element. */
  options: Option[];
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
  /** Default message shown on select input */
  placeholder?: string;
}

const MultiSelect: React.FunctionComponent<MultiSelectProps> = ({
  id,
  label,
  name,
  options,
  rules,
  placeholder,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <Controller
        name={name}
        render={({ field }) => (
          <ReactSelect
            isMulti
            {...field}
            placeholder={placeholder}
            options={options}
            required
          />
        )}
        control={control}
        rules={rules}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  );
};

export default MultiSelect;
