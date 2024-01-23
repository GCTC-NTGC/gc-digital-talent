import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import isArray from "lodash/isArray";
import omit from "lodash/omit";

import { formMessages } from "@gc-digital-talent/i18n";

import useFieldState from "../../hooks/useFieldState";
import Field from "../Field";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useInputStyles from "../../hooks/useInputStyles";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import { CommonInputProps, HTMLInputProps } from "../../types";
import {
  getErrorMessage,
  getMinMaxValue,
  getMultiDefaultValue,
  getSingleDefaultValue,
} from "./utils";
import { BaseProps } from "./types";
import Single from "./Single";
import Multi from "./Multi";
import { alphaSortOptions } from "../../utils";

export type ComboboxProps = Omit<HTMLInputProps, "ref"> &
  CommonInputProps & {
    /** Array of available options */
    options: BaseProps["options"];
    /** Optional: Callback ran when the user types in the input */
    onSearch?: (term: string) => void;
    /** Optional: Control the options through external search (API, etc.) */
    isExternalSearch?: BaseProps["isExternalSearch"];
    /** Button text to clear the current text from the input (optional) */
    clearLabel?: BaseProps["clearLabel"];
    /** Button text to toggle the options menu (optional) */
    toggleLabel?: BaseProps["toggleLabel"];
    /** Optional: Set if the options are being fetched */
    fetching?: BaseProps["fetching"];
    /** Optional: Total number available options (use for API driven where options is not the total length) */
    total?: BaseProps["total"];
    /** Optional: Accept multiple values (must be array type in form values) */
    isMulti?: boolean;
    /** Determine if it should sort options in alphanumeric ascending order */
    doNotSort?: boolean;
  };

const Combobox = ({
  id,
  label,
  clearLabel,
  toggleLabel,
  name,
  context,
  options,
  rules = {},
  readOnly,
  total,
  trackUnsaved = true,
  onSearch,
  fetching = false,
  isExternalSearch = false,
  isMulti = false,
  doNotSort = false,
}: ComboboxProps) => {
  const intl = useIntl();
  const {
    watch,
    control,
    setValue,
    formState: { errors, defaultValues },
  } = useFormContext();
  const baseStyles = useInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(name || "", !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const error = errors[name]?.message as FieldError;
  const isRequired = !!rules?.required;
  const defaultValue = defaultValues && defaultValues[name];
  const currentValue = watch(name);
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const inputProps: HTMLInputProps = {
    ...baseStyles,
    ...stateStyles,
    readOnly,
    "aria-describedby": ariaDescribedBy,
  };

  const sharedProps: BaseProps = {
    options,
    label,
    isRequired,
    inputProps,
    fetching,
    isExternalSearch,
    total: total || options.length,
    clearLabel: clearLabel || intl.formatMessage(formMessages.resetCombobox),
    toggleLabel: toggleLabel || intl.formatMessage(formMessages.toggleCombobox),
  };

  const isMoreThanMin = (value: string | string[]) => {
    if (!rules.min || !value || !isArray(value)) {
      return true;
    }

    const minValue = getMinMaxValue(rules.min);

    return value.length >= minValue || getErrorMessage(rules.min);
  };

  const isLessThanMax = (value: string | string[]) => {
    if (!rules.max || !value || !isArray(value)) {
      return true;
    }

    const maxValue = getMinMaxValue(rules.max);

    return value.length <= maxValue || getErrorMessage(rules.max);
  };

  const optionsModified = useMemo(() => {
    return doNotSort ? options : alphaSortOptions(options);
  }, [doNotSort, options]);
  return (
    <Field.Wrapper>
      <Controller
        control={control}
        name={name}
        rules={
          !isMulti
            ? rules
            : {
                ...omit(rules, "min", "max"),
                validate: {
                  isMoreThanMin,
                  isLessThanMax,
                },
              }
        }
        render={() =>
          isMulti ? (
            <Multi
              onInputChange={onSearch}
              onSelectedChange={(items) => {
                setValue(name, items?.map((item) => item.value));
              }}
              value={getMultiDefaultValue(
                optionsModified,
                defaultValue,
                currentValue,
              )}
              {...sharedProps}
            />
          ) : (
            <Single
              onInputChange={onSearch}
              onSelectedChange={(item) => setValue(name, item?.value)}
              value={getSingleDefaultValue(
                optionsModified,
                defaultValue,
                currentValue,
              )}
              {...sharedProps}
            />
          )
        }
      />
      <Field.Descriptions
        ids={descriptionIds}
        error={error}
        context={context}
      />
    </Field.Wrapper>
  );
};

export default Combobox;
