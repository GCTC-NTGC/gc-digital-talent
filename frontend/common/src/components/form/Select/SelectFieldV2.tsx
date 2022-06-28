import React from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import ReactSelect, { Options, PropsValue } from "react-select";
import { InputWrapper } from "../../inputPartials";

export type Option = { value: string | number; label: string };

export interface SelectFieldV2Props {
  /** HTML id used to identify the element. */
  id: string;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** The text for the label associated with the select input. */
  label: string;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options for the select element. */
  options: Options<Option>;
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
  /** Default message shown on select input. */
  placeholder?: string;
  /** Whether field allows multiple selections. */
  isMulti?: boolean;
}

// User-defined type guard for react-select's readonly Options.
// See: https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
function isArray<T>(arg: unknown): arg is readonly T[] {
  return Array.isArray(arg);
}

const SelectFieldV2 = ({
  id,
  context,
  label,
  name,
  options,
  rules,
  placeholder,
  isMulti = false,
}: SelectFieldV2Props): JSX.Element => {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;
  const isRequired = !!rules?.required;

  return (
    <div data-h2-margin="b(bottom, xxs)">
      <InputWrapper
        {...{ label, context, error }}
        inputId={id}
        required={isRequired}
      >
        <div style={{ width: "100%" }}>
          <Controller
            {...{ name, rules }}
            aria-required={isRequired}
            render={({ field }) => {
              /** Converts our react-hook-form state to Option format that
               * react-select understands. */
              const convertValueToOption = (val: Option["value"]) =>
                options.find((o) => val === o.value);
              /** Converts react-select's more complex Option type into state we
               * want in react-hook-form: an array of values. This works whether
               * react-select is working with Option[] (MultiValue) or Option
               * (SingleValue) */
              const convertSingleOrMultiOptionsToValues = (
                singleOrMulti: PropsValue<Option>,
              ) =>
                isArray<Option>(singleOrMulti)
                  ? field.onChange(singleOrMulti.map((o) => o.value))
                  : field.onChange(singleOrMulti?.value || null);

              return (
                <ReactSelect
                  isClearable={isMulti || !isRequired}
                  {...field}
                  {...{ placeholder, options, isMulti }}
                  value={convertValueToOption(field.value)}
                  // This only affects react-hook-form state, not internal react-select state.
                  onChange={convertSingleOrMultiOptionsToValues}
                  aria-label={label}
                  styles={{
                    placeholder: (provided) => ({
                      ...provided,
                      color: `#646464`,
                    }),
                  }}
                />
              );
            }}
          />
        </div>
      </InputWrapper>
    </div>
  );
};

export default SelectFieldV2;
