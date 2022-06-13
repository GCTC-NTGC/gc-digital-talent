import React from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import get from "lodash/get";
import { InputWrapper } from "../../inputPartials";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** The text for the label associated with the select input. */
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options for the select element. */
  options: { value: string | number; label: string; disabled?: boolean }[];
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
    <div data-h2-margin="b(auto, auto, x.125, auto)">
      <InputWrapper
        inputId={id}
        label={label}
        required={!!rules?.required}
        context={context}
        error={error}
      >
        <select
          data-h2-radius="b(s)"
          data-h2-padding="b(0, 0, 0, x.125)"
          data-h2-font-size="b(copy)"
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
            <option
              data-h2-font-size="b(copy)"
              data-h2-font-family="b(sans)"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </InputWrapper>
    </div>
  );
};

export default Select;
