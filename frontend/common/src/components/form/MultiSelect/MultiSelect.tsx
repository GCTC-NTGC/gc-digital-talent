import React, { useMemo } from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import ReactSelect from "react-select";
import { InputWrapper } from "../../inputPartials";

export type Option = { value: string | number; label: string };

export interface MultiSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** Optional context which user can view by toggling a button. */
  context?: string;
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
  context,
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
  const optionMap = useMemo(() => {
    const map = new Map();
    options.forEach((option) => {
      map.set(option.value, option.label);
    });
    return map;
  }, [options]);
  const valueToOption = (v: string | number) => ({
    value: v,
    label: optionMap.get(v) ?? String(v),
  });
  return (
    <div data-h2-margin="b(bottom, xxs)">
      <InputWrapper
        inputId={id}
        label={label}
        required={!!rules?.required}
        context={context}
        error={error}
      >
        <div style={{ width: "100%" }}>
          <Controller
            name={name}
            render={({ field }) => (
              <ReactSelect
                isMulti
                {...field}
                value={field.value ? field.value.map(valueToOption) : []}
                onChange={
                  (x) => field.onChange(x ? x.map((option) => option.value) : x) // If x is null or undefined, return it to form
                }
                placeholder={placeholder}
                options={options}
                aria-label={label}
                styles={{
                  placeholder: (provided) => ({
                    ...provided,
                    color: `#646464`,
                  }),
                }}
              />
            )}
            control={control}
            rules={rules}
            aria-required={rules?.required ? "true" : undefined}
          />
        </div>
      </InputWrapper>
    </div>
  );
};

export default MultiSelect;
