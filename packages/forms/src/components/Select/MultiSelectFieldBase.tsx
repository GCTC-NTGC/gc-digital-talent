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
import flatMap from "lodash/flatMap";
import orderBy from "lodash/orderBy";
import { useIntl } from "react-intl";

import { errorMessages, formMessages } from "@gc-digital-talent/i18n";

import Field from "../Field";
import type { CommonInputProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";

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
    baseStyles?: Record<string, string>;
    ariaDescription?: string;
  }
}

export type MultiSelectFieldBaseProps = CommonInputProps & {
  /** List of options for the select element. */
  options?: Options;
  /** Default message shown on select input. */
  placeholder?: string;
  /** Whether field is disabled. */
  isDisabled?: boolean;
  /** Whether field allows multiple selections. */
  isMulti?: boolean;
  /** Whether to force all form values into array, even single Select. */
  forceArrayFormValue?: boolean;
  isLoading?: boolean;
  doNotSort?: boolean;
  /** Determine if it should sort options in alphanumeric ascending order */
};

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
      {formatMessage(formMessages.loading)}
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
      {formatMessage(formMessages.noOptions)}
    </components.NoOptionsMessage>
  );
};

const StateStyledSelectContainer = ({
  children,
  ...props
}: ContainerProps<Option | Group<Option>>) => {
  const { stateStyles, baseStyles } = props.selectProps;

  return (
    <div
      data-h2-background-color="base(white)"
      {...baseStyles}
      {...stateStyles}
      data-h2-padding="base(x.25)"
    >
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

/**
 * MultiSelectFieldBase should not be used on its own. MultiSelectField should be used instead.
 */
const MultiSelectFieldBase = ({
  id,
  context,
  label,
  name,
  options = [],
  rules = {},
  placeholder,
  isDisabled = false,
  isMulti = false,
  forceArrayFormValue = false,
  isLoading = false,
  trackUnsaved = true,
  doNotSort = false,
}: MultiSelectFieldBaseProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const defaultPlaceholder = formatMessage(formMessages.defaultPlaceholder);
  const {
    formState: { errors },
  } = useFormContext();
  const baseStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const error = errors[name]?.message as FieldError;
  const isRequired = !!rules.required;
  // react-hook-form has no way to set default messages when `{ required: true }`,
  // so that's handled here. (It's a hook because it uses react-intl hook.)
  // See: https://github.com/react-hook-form/react-hook-form/issues/458
  const rulesWithDefaults = useRulesWithDefaultMessages(
    label?.toString() ?? "",
    rules,
  );
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const optionsModified = useMemo(() => {
    return doNotSort ? options : sortOptions(options);
  }, [doNotSort, options]);

  return (
    <Field.Wrapper>
      <Field.Label id={`${id}-label`} htmlFor={id} required={!!rules.required}>
        {label}
      </Field.Label>
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
              aria-label={label?.toString()}
              aria-required={isRequired}
              ariaDescription={ariaDescribedBy}
              baseStyles={baseStyles}
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
      <Field.Descriptions
        ids={descriptionIds}
        error={error}
        context={context}
      />
    </Field.Wrapper>
  );
};

export default MultiSelectFieldBase;
