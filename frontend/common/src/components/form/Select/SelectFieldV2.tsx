import React from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import ReactSelect, { Options, PropsValue } from "react-select";
import camelCase from "lodash/camelCase";
import { InputWrapper } from "../../inputPartials";

export type Option = { value: string | number; label: string };

export interface SelectFieldV2Props {
  /** Optional HTML id used to identify the element. Default: camelCase of `label`. */
  id?: string;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** The text for the label associated with the select input. */
  label: string;
  /** Optional string specifying a name for the input control. Default: `id` value. */
  name?: string;
  /** List of options for the select element. */
  options?: Options<Option>;
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
  options = [],
  rules,
  placeholder,
  isMulti = false,
}: SelectFieldV2Props): JSX.Element => {
  // Defaults from minimal attributes.
  id ??= camelCase(label); // eslint-disable-line no-param-reassign
  name ??= id; // eslint-disable-line no-param-reassign

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
            render={({ field }) => {
              /** Converts our react-hook-form state to Option or Option[]
               * format that react-select understands. */
              const convertValueToOption = (
                val: Option["value"] | Option["value"][],
              ) =>
                isArray<Option["value"]>(val)
                  ? // Converts to Option[] for MultiSelect.
                    options.filter((o) => val?.includes(o.value)) || []
                  : // Converts to Option or null for single Select.
                    options.find((o) => val === o.value) || null;

              const convertSingleOrMultiOptionsToValues = (
                singleOrMulti: PropsValue<Option>,
              ) =>
                isArray<Option>(singleOrMulti)
                  ? field.onChange(singleOrMulti.map((o) => o.value))
                  : field.onChange(singleOrMulti ? [singleOrMulti?.value] : []);

              return (
                <ReactSelect
                  isClearable={isMulti || !isRequired}
                  {...field}
                  {...{ placeholder, options, isMulti }}
                  value={convertValueToOption(field.value)}
                  // This only affects react-hook-form state, not internal react-select state.
                  onChange={convertSingleOrMultiOptionsToValues}
                  aria-label={label}
                  aria-required={isRequired}
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
