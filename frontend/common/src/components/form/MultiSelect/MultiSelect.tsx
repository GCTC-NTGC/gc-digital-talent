import React, { useMemo } from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import ReactSelect from "react-select";
import { InputWrapper } from "../../inputPartials";

export type Option = { value: string | number; label: string };

export interface MultiSelectProps {
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

const MultiSelect = ({
  id,
  context,
  label,
  name,
  options,
  rules,
  placeholder,
}: MultiSelectProps): JSX.Element => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;
  const isRequired = !!rules?.required;
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
        {...{ label, context, error }}
        inputId={id}
        required={isRequired}
      >
        <div style={{ width: "100%" }}>
          <Controller
            {...{ name, control, rules }}
            aria-required={isRequired}
            render={({ field }) => (
              <ReactSelect
                isMulti
                {...field}
                {...{ placeholder, options }}
                value={field.value ? field.value.map(valueToOption) : []}
                onChange={
                  (x) => field.onChange(x ? x.map((option) => option.value) : x) // If x is null or undefined, return it to form
                }
                aria-label={label}
                styles={{
                  placeholder: (provided) => ({
                    ...provided,
                    color: `#646464`,
                  }),
                }}
              />
            )}
          />
        </div>
      </InputWrapper>
    </div>
  );
};

export default MultiSelect;
