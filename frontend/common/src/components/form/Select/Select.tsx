import React from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import get from "lodash/get";
import { InputWrapper } from "../../inputPartials";

export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** The text for the label associated with the select input. */
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options for the select element. */
  options: Option[];
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** Null selection string provides a null value with instructions to user (eg. Select a department...) */
  nullSelection?: string;
}

const Select: React.FunctionComponent<SelectProps> = ({
  id,
  label,
  name,
  options,
  rules,
  context,
  nullSelection,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message;
  return (
    <div data-h2-margin="base(x1, 0)">
      <InputWrapper
        inputId={id}
        label={label}
        required={!!rules?.required}
        context={context}
        error={error}
      >
        <select
          data-h2-background-color="base(dt-white)"
          data-h2-padding="base(x.25, x.5)"
          data-h2-radius="base(input)"
          data-h2-border="base(all, 1px, solid, dt-gray)"
          id={id}
          style={{ width: "100%", paddingTop: "4.5px", paddingBottom: "4.5px" }}
          {...register(name, rules)}
          aria-invalid={error ? "true" : "false"}
          aria-required={rules?.required ? "true" : undefined}
          {...rest}
          defaultValue=""
        >
          {nullSelection && (
            <option value="" disabled>
              {nullSelection}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </InputWrapper>
    </div>
  );
};

export default Select;
