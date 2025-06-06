import { DetailedHTMLProps, SelectHTMLAttributes, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { tv } from "tailwind-variants";

import { nodeToString } from "@gc-digital-talent/helpers";

import Field from "../Field";
import type { CommonInputProps, OptGroupOrOption } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import { alphaSortOptions } from "../../utils";
import { selectStyles } from "../../styles";

const select = tv({
  extend: selectStyles,
  base: "w-full",
});

export type SelectProps = CommonInputProps &
  DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > & {
    /** List of options and/or optgroups for the select element. */
    options: OptGroupOrOption[];
    /** Null selection string provides a null value with instructions to user (e.g. Select a department) */
    nullSelection: string;
    /** Allow users to select the null option */
    enableNull?: boolean;
    /** Determine if it should sort options in alphanumeric ascending order */
    doNotSort?: boolean;
  };

function sortOptions(options: OptGroupOrOption[]) {
  const tempOptions = options.map((option: OptGroupOrOption) =>
    Object.prototype.hasOwnProperty.call(option, "options")
      ? {
          ...option,
          label: option.label,
          options: alphaSortOptions(option.options),
        }
      : option,
  );
  return alphaSortOptions(tempOptions);
}

const Select = ({
  id,
  label,
  name,
  options,
  rules = {},
  context,
  nullSelection,
  enableNull,
  "aria-describedby": describedBy,
  trackUnsaved = true,
  doNotSort = false,
  ...rest
}: SelectProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const isInvalid = fieldState === "invalid";
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    describedBy,
    show: {
      error: isInvalid,
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
        aria-invalid={isInvalid}
        defaultValue=""
        {...register(name, rules)}
        className={select({ state: fieldState })}
        {...rest}
      >
        <option
          value=""
          className="text-gray-600/70 dark:text-gray-100/70"
          disabled={!enableNull}
        >
          {nullSelection}
        </option>
        {optionsModified.map((option) =>
          Object.prototype.hasOwnProperty.call(option, "options") ? (
            <optgroup
              key={`optgroup${nodeToString(option.label)}`}
              label={nodeToString(option.label)}
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
      <Field.Descriptions ids={descriptionIds} {...{ errors, name, context }} />
    </Field.Wrapper>
  );
};

export default Select;
