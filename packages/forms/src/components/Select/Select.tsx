import React, { useMemo } from "react";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isString from "lodash/isString";

import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import InputWrapper from "../InputWrapper";

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
export type OptGroupOrOption = OptGroup | Option;

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** HTML id used to identify the element. */
  id: string;
  /** The text for the label associated with the select input. */
  label: string | React.ReactNode;
  /** A string specifying a name for the input control. */
  name: string;
  /** List of options and/or optgroups for the select element. */
  options: OptGroupOrOption[];
  /** Object set of validation rules to impose on input. */
  rules?: RegisterOptions;
  /** Optional context which user can view by toggling a button. */
  context?: string;
  /** Null selection string provides a null value with instructions to user (eg. Select a department...) */
  nullSelection?: string;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
  /** Determine if it should sort options in alphanumeric ascending order */
  doNotSort?: boolean;
  /** Hides the (optional) label if true */
  hideOptional?: boolean;
}

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
  rules,
  context,
  nullSelection,
  hideOptional,
  trackUnsaved = true,
  doNotSort = false,
  ...rest
}: SelectProps) => {
  const [isContextVisible, setContextVisible] = React.useState<boolean>(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const error = get(errors, name)?.message as FieldError;
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
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
    <div data-h2-margin="base(x1, 0)">
      <InputWrapper
        inputId={id}
        inputName={name}
        label={label}
        required={!!rules?.required}
        context={context}
        error={error}
        trackUnsaved={trackUnsaved}
        onContextToggle={setContextVisible}
        descriptionIds={descriptionIds}
        hideOptional={hideOptional}
      >
        <select
          data-h2-padding="base(x.25, x.5)"
          data-h2-radius="base(input)"
          data-h2-width="base(100%)"
          data-h2-min-height="base(40px)"
          {...stateStyles}
          id={id}
          {...register(name, rules)}
          aria-invalid={error ? "true" : "false"}
          aria-required={rules?.required ? "true" : undefined}
          aria-describedby={ariaDescribedBy}
          {...rest}
          defaultValue=""
        >
          {nullSelection && (
            <option value="" disabled>
              {nullSelection}
            </option>
          )}
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
      </InputWrapper>
    </div>
  );
};

export default Select;
