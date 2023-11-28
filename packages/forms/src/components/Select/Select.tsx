import React, { useMemo } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isString from "lodash/isString";

import Field from "../Field";
import type { CommonInputProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useInputStyles from "../../hooks/useCommonInputStyles";

export type Option = {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
  options?: Option[];
  /** Aria labels for alternate text that will be read by assistive technologies. */
  ariaLabel?: string;
};
export type OptGroup = {
  label: React.ReactNode;
  options: Option[];
  disabled?: boolean;
  value?: string | number;
  /** Aria labels for alternate text that will be read by assistive technologies. */
  ariaLabel?: string;
};
type OptGroupOrOption = OptGroup | Option;

export type SelectProps = CommonInputProps &
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > & {
    /** List of options and/or optgroups for the select element. */
    options: OptGroupOrOption[];
    /** Null selection string provides a null value with instructions to user (e.g. Select a department) */
    nullSelection: string;
    /** Determine if it should sort options in alphanumeric ascending order */
    doNotSort?: boolean;
  };

function sortOptions(options: OptGroupOrOption[]) {
  const tempOptions = options.map((option: OptGroupOrOption) =>
    Object.prototype.hasOwnProperty.call(option, "options")
      ? {
          label: option.label,
          options: orderBy(
            option.options,
            ({ label }) =>
              isString(label)
                ? label
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLocaleLowerCase()
                : label,
            "asc",
          ),
        }
      : option,
  );
  return orderBy(
    tempOptions,
    ({ label }) =>
      isString(label)
        ? label
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase()
        : label,
    "asc",
  );
}

const Select = ({
  id,
  label,
  name,
  options,
  rules = {},
  context,
  nullSelection,
  "aria-describedby": describedBy,
  trackUnsaved = true,
  doNotSort = false,
  ...rest
}: SelectProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const baseStyles = useInputStyles("select");
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    describedBy,
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
      <select
        id={id}
        aria-describedby={ariaDescribedBy}
        aria-required={!!rules.required}
        aria-invalid={!!error}
        defaultValue=""
        data-h2-width="base(100%)"
        {...baseStyles}
        {...stateStyles}
        {...register(name, rules)}
        {...rest}
      >
        <option data-h2-color="base(gray.dark)" value="" disabled>
          {nullSelection}
        </option>
        {optionsModified.map((option) =>
          Object.prototype.hasOwnProperty.call(option, "options") ? (
            <optgroup
              key={`optgroup${option.label}`}
              label={option.label?.toString() ?? ""}
            >
              {option.options?.map(
                ({ value, label: optionLabel, ariaLabel }) => (
                  <option aria-label={ariaLabel} key={value} value={value}>
                    {optionLabel}
                  </option>
                ),
              )}
            </optgroup>
          ) : (
            <option
              aria-label={option.ariaLabel}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ),
        )}
      </select>
      <Field.Descriptions
        ids={descriptionIds}
        error={error}
        context={context}
      />
    </Field.Wrapper>
  );
};

export default Select;
