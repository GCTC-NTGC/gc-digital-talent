import React, { useMemo } from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import type { RegisterOptions } from "react-hook-form";
import ReactSelect, {
  components,
  ContainerProps,
  InputProps,
  MultiValue,
  SingleValue,
} from "react-select";
import type { NoticeProps, GroupBase, OptionsOrGroups } from "react-select";
import camelCase from "lodash/camelCase";
import flatMap from "lodash/flatMap";
import orderBy from "lodash/orderBy";
import { useIntl } from "react-intl";

import { errorMessages } from "@gc-digital-talent/i18n";

import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import InputWrapper from "../InputWrapper";

export type Option = { value: string | number; label: string };
export type Group<T> = {
  label: string;
  options: Array<T>;
};
export type Options = OptionsOrGroups<Option, Group<Option>>;

declare module "react-select/dist/declarations/src/Select" {
  export interface Props<
    /* eslint-disable @typescript-eslint/no-shadow, @typescript-eslint/no-unused-vars */
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>,
    /* eslint-enable @typescript-eslint/no-shadow, @typescript-eslint/no-unused-vars */
  > {
    stateStyles?: Record<string, string>;
    ariaDescription?: string;
  }
}

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
  options?: Options;
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
  /** Default message shown on select input. */
  placeholder?: string;
  /** Whether field is disabled. */
  isDisabled?: boolean;
  /** Whether field allows multiple selections. */
  isMulti?: boolean;
  /** Whether to force all form values into array, even single Select. */
  forceArrayFormValue?: boolean;
  isLoading?: boolean;
  trackUnsaved?: boolean;
  doNotSort?: boolean;
  /** Determine if it should sort options in alphanumeric ascending order */
}

// User-defined type guard for react-select's readonly Options.
// See: https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
function isArray<T>(arg: unknown): arg is readonly T[] {
  return Array.isArray(arg);
}

function sortOptions(options: Options): Options {
  const tempOptions: Options = options.map((option) =>
    "options" in option
      ? {
          label: option.label,
          options: orderBy(
            option.options,
            ({ label }) =>
              label
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLocaleLowerCase(),
            "asc",
          ),
        }
      : option,
  );
  return orderBy(
    tempOptions,
    ({ label }) =>
      label
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase(),
    "asc",
  );
}

// See: https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/components/Menu.tsx#L497-L503
const LocalizedLoadingMessage = <
  Option_,
  IsMulti extends boolean,
  Group_ extends GroupBase<Option_>,
>(
  props: NoticeProps<Option_, IsMulti, Group_>,
) => {
  const { formatMessage } = useIntl();

  return (
    <components.LoadingMessage {...props}>
      {formatMessage({
        defaultMessage: "Loading...",
        id: "ylHC90",
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
  Group_ extends GroupBase<Option_>,
>(
  props: NoticeProps<Option_, IsMulti, Group_>,
) => {
  const { formatMessage } = useIntl();

  return (
    <components.NoOptionsMessage {...props}>
      {formatMessage({
        defaultMessage: "No options",
        id: "lsFH+y",
        description:
          "Message shown in options dropdown when Select field has no options.",
      })}
    </components.NoOptionsMessage>
  );
};

const StateStyledSelectContainer = ({
  children,
  ...props
}: ContainerProps<Option | Group<Option>>) => {
  const { stateStyles } = props.selectProps;

  return (
    <div {...stateStyles} data-h2-radius="base(input)">
      <components.SelectContainer {...props}>
        {children}
      </components.SelectContainer>
    </div>
  );
};

const Input = ({
  selectProps,
  ...rest
}: InputProps<Option | Group<Option>>) => {
  const { ariaDescription } = selectProps;
  return (
    <components.Input
      {...rest}
      selectProps={selectProps}
      aria-describedby={ariaDescription || rest["aria-describedby"]}
    />
  );
};

/**
 * One-off hook to add default messages to validation rule object in place of booleans.
 *
 * @param fieldLabel label to pass to default messages for accessibility purposes
 * @param rules initial rule object
 * @returns modified rule object
 */
export const useRulesWithDefaultMessages = (
  fieldLabel: string,
  rules: RegisterOptions = {},
) => {
  const { formatMessage } = useIntl();
  const rulesWithDefaults = { ...rules };

  if (rules.required === true)
    rulesWithDefaults.required = formatMessage(errorMessages.required, {
      fieldLabel,
    });

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
  isDisabled = false,
  isMulti = false,
  forceArrayFormValue = false,
  isLoading = false,
  trackUnsaved = true,
  doNotSort = false,
}: SelectFieldV2Props): JSX.Element => {
  const { formatMessage } = useIntl();
  const [isContextVisible, setContextVisible] = React.useState<boolean>(false);

  const defaultPlaceholder = formatMessage({
    defaultMessage: "Select...",
    id: "rQwIDB",
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

  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;

  const error = errors[name]?.message as FieldError;
  const isRequired = !!rules?.required;
  // react-hook-form has no way to set default messages when `{ required: true }`,
  // so that's handled here. (It's a hook because it uses react-intl hook.)
  // See: https://github.com/react-hook-form/react-hook-form/issues/458
  const rulesWithDefaults = useRulesWithDefaultMessages(label, rules);

  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context: context && isContextVisible,
    },
  });

  const optionsModified = useMemo(() => {
    return doNotSort ? options : sortOptions(options);
  }, [doNotSort, options]);

  return (
    <div data-h2-margin="base(0, 0, x.125, 0)">
      <InputWrapper
        {...{ label, context, error }}
        inputId={name}
        inputName={name}
        required={isRequired}
        trackUnsaved={trackUnsaved}
        onContextToggle={setContextVisible}
        descriptionIds={descriptionIds}
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
              ) => {
                const hasGroups = optionsModified.some(
                  (option) => "options" in option,
                );
                const flattenedOptions = hasGroups
                  ? flatMap(optionsModified, (o) =>
                      "options" in o ? o.options : o,
                    )
                  : optionsModified;

                if (isArray<Option["value"] | Options>(val)) {
                  return (
                    flattenedOptions.filter((o) => {
                      return "value" in o ? val?.includes(o.value) : false;
                    }) || []
                  );
                }
                return (
                  flattenedOptions.find((o) => {
                    return "value" in o && val === o.value;
                  }) || null
                );
              };

              /** Converts react-select's Option type storage formats into state
               * we want in react-hook-form: a value or array of values. This
               * works whether react-select is storing a MultiValue (Option[]))
               * or SingleValue (Option). */
              const convertSingleOrMultiOptionsToValues = (
                newValue:
                  | MultiValue<Option | Group<Option>>
                  | SingleValue<Option | Group<Option>>,
              ) => {
                // Stores MultiValue as array of values.
                if (isArray<Option>(newValue)) {
                  return field.onChange(newValue.map((o) => o.value));
                }

                // Stores SingleValue as array of one value, or null as empty array.
                if (forceArrayFormValue) {
                  return field.onChange(
                    newValue
                      ? ["value" in newValue ? newValue?.value : newValue]
                      : [],
                  );
                }

                // Stores SingleValue as value or null
                return field.onChange(
                  newValue && "value" in newValue ? newValue.value : null,
                );
              };

              // For WCAG-compliant contrasts.
              const accessibleTextStyle = {
                color: "#595959",
              };

              return (
                <ReactSelect
                  isDisabled={isDisabled}
                  isClearable={isMulti || !isRequired}
                  placeholder={placeholder || defaultPlaceholder}
                  components={{
                    LoadingMessage: LocalizedLoadingMessage,
                    NoOptionsMessage: LocalizedNoOptionsMessage,
                    SelectContainer: StateStyledSelectContainer,
                    Input,
                  }}
                  // Adds predictable prefix, helpful for both theming and Jest testing.
                  // E.g., `react-select__control` instead of `css-1s2u09g__control`.
                  classNamePrefix="react-select"
                  {...field}
                  {...{ options: optionsModified, isMulti, isLoading }}
                  value={convertValueToOption(field.value)}
                  // This only affects react-hook-form state, not internal react-select state.
                  onChange={convertSingleOrMultiOptionsToValues}
                  aria-label={label}
                  aria-required={isRequired}
                  ariaDescription={ariaDescribedBy}
                  stateStyles={stateStyles}
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
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: isDisabled ? "lightgrey" : "inherit",
                      border: "none",
                      boxShadow: "none",
                    }),
                    // Setting the z-index to 11 since the InputLabel is set to 10.
                    menu: (provided) => ({ ...provided, zIndex: 11 }),
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
