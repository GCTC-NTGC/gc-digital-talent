import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { RegisterOptions } from "react-hook-form";
import ReactSelect, { components } from "react-select";
import type { NoticeProps, PropsValue, GroupBase, Options } from "react-select";
import camelCase from "lodash/camelCase";
import { useIntl } from "react-intl";
import { errorMessages } from "../../../messages";
import { InputWrapper } from "../../inputPartials";

export type Option = { value: string | number; label: string };

// TODO: Eventually extend react-select's Select Props, so that anything extra is passed through.
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
  /** Whether to force all form values into array, even single Select. */
  forceArrayFormValue?: boolean;
  isLoading?: boolean;
}

// User-defined type guard for react-select's readonly Options.
// See: https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
function isArray<T>(arg: unknown): arg is readonly T[] {
  return Array.isArray(arg);
}

// See: https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/components/Menu.tsx#L497-L503
const LocalizedLoadingMessage = <
  Option_,
  IsMulti extends boolean,
  Group extends GroupBase<Option_>,
>(
  props: NoticeProps<Option_, IsMulti, Group>,
) => {
  const { formatMessage } = useIntl();

  return (
    <components.LoadingMessage {...props}>
      {formatMessage({
        defaultMessage: "Loading...",
        description:
          "Message shown in options dropdown when Select field is loading options.",
      })}
    </components.LoadingMessage>
  );
};

// See: https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/components/Menu.tsx##L469-L475
const LocalizedNoOptionsMessage = <
  Option_,
  IsMulti extends boolean,
  Group extends GroupBase<Option_>,
>(
  props: NoticeProps<Option_, IsMulti, Group>,
) => {
  const { formatMessage } = useIntl();

  return (
    <components.NoOptionsMessage {...props}>
      {formatMessage({
        defaultMessage: "No options",
        description:
          "Message shown in options dropdown when Select field has no options.",
      })}
    </components.NoOptionsMessage>
  );
};
/**
 * One-off hook to add default messages to validation rule object in place of booleans.
 *
 * @param rules initial rule object
 * @returns modified rule object
 */
export const useRulesWithDefaultMessages = (rules: RegisterOptions = {}) => {
  const { formatMessage } = useIntl();
  const rulesWithDefaults = { ...rules };

  if (rules.required === true)
    rulesWithDefaults.required = formatMessage(errorMessages.required);

  return rulesWithDefaults;
};

const SelectFieldV2 = ({
  id,
  context,
  label,
  name,
  options = [],
  rules,
  placeholder,
  isMulti = false,
  forceArrayFormValue = false,
  isLoading = false,
}: SelectFieldV2Props): JSX.Element => {
  const { formatMessage } = useIntl();

  const defaultPlaceholder = formatMessage({
    defaultMessage: "Select...",
    description:
      "Default placeholder shown when Select field has nothing actively selected.",
  });

  // Defaults from minimal attributes.
  id ??= camelCase(label); // eslint-disable-line no-param-reassign
  name ??= id; // eslint-disable-line no-param-reassign

  const {
    formState: { errors },
    // TODO: Set explicit TFieldValues. Defaults to Record<string, any>
  } = useFormContext();

  const error = errors[name]?.message;
  const isRequired = !!rules?.required;
  // react-hook-form has no way to set default messages when `{ required: true }`,
  // so that's handled here. (It's a hook because it uses react-intl hook.)
  // See: https://github.com/react-hook-form/react-hook-form/issues/458
  const rulesWithDefaults = useRulesWithDefaultMessages(rules);

  return (
    <div data-h2-margin="b(bottom, xxs)">
      <InputWrapper
        {...{ label, context, error }}
        inputId={id}
        required={isRequired}
      >
        <div style={{ width: "100%" }}>
          <Controller
            {...{ name }}
            rules={rulesWithDefaults}
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

              /** Converts react-select's Option type storage formats into state
               * we want in react-hook-form: a value or array of values. This
               * works whether react-select is storing a MultiValue (Option[]))
               * or SingleValue (Option). */
              const convertSingleOrMultiOptionsToValues = (
                singleOrMulti: PropsValue<Option>,
              ) =>
                /* eslint-disable no-nested-ternary, prettier/prettier */
                isArray<Option>(singleOrMulti)
                  // Stores MultiValue as array of values.
                  ? field.onChange(singleOrMulti.map((o) => o.value))
                  : forceArrayFormValue
                    // Stores SingleValue as array of one value, or null as empty array.
                    ? field.onChange(singleOrMulti ? [singleOrMulti?.value] : [])
                    // Stores SingleValue as value or null
                    : field.onChange(singleOrMulti?.value || null);
                /* eslint-enable no-nested-ternary, prettier/prettier */

              // For WCAG-compliant contrasts.
              const accessibleTextStyle = {
                color: "#646464",
              };

              return (
                <ReactSelect
                  isClearable={isMulti || !isRequired}
                  placeholder={placeholder || defaultPlaceholder}
                  components={{
                    LoadingMessage: LocalizedLoadingMessage,
                    NoOptionsMessage: LocalizedNoOptionsMessage,
                  }}
                  // Adds predictable prefix, helpful for both theming and Jest testing.
                  // E.g., `react-select__control` instead of `css-1s2u09g__control`.
                  classNamePrefix="react-select"
                  {...field}
                  {...{ options, isMulti, isLoading }}
                  value={convertValueToOption(field.value)}
                  // This only affects react-hook-form state, not internal react-select state.
                  onChange={convertSingleOrMultiOptionsToValues}
                  aria-label={label}
                  aria-required={isRequired}
                  styles={{
                    placeholder: (provided) => ({
                      ...provided,
                      ...accessibleTextStyle,
                    }),
                    loadingMessage: (provided) => ({
                      ...provided,
                      ...accessibleTextStyle,
                    }),
                    noOptionsMessage: (provided) => ({
                      ...provided,
                      ...accessibleTextStyle,
                    }),
                    loadingIndicator: (provided) => ({
                      ...provided,
                      ...accessibleTextStyle,
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
