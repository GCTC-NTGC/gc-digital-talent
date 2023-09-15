import React from "react";
import { useIntl } from "react-intl";
import { Controller, FieldError, useFormContext } from "react-hook-form";

import useFieldState from "../../hooks/useFieldState";
import Field from "../Field";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import { CommonInputProps, HTMLInputProps } from "../../types";
import { Option } from "./types";
import Single from "./Single";

export type ComboboxProps = Omit<HTMLInputProps, "ref"> &
  CommonInputProps & {
    /** Array of available options */
    options: Option[];
    /** Optional: Set if the options are being fetched */
    fetching?: boolean;
    /** Optional: Callback ran when the user types in the input */
    onSearch?: (term: string) => void;
    /** Optional: Control the options through external search (API, etc.) */
    isExternalSearch?: boolean;
    /** Button text to clear the current text from the input (optional) */
    clearLabel?: string;
    /** Optional: Accept multiple values (must be array type in form values) */
    isMulti?: boolean;
  };

const Combobox = ({
  id,
  label,
  clearLabel,
  name,
  context,
  options,
  rules = {},
  readOnly,
  trackUnsaved = true,
  onSearch,
  fetching = false,
  isExternalSearch = false,
  isMulti = false,
  ...rest
}: ComboboxProps) => {
  const intl = useIntl();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const baseStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(name || "", !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const error = errors[name]?.message as FieldError;
  const isRequired = !!rules?.required;
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
    "aria-describedby": ariaDescribedBy,
  };

  const handleInputChange = (value: string) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const getSingleSelectedItem = (value?: string) => {
    return options.find((option) => option.value === value);
  };

  return (
    <Field.Wrapper>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
          <Single
            onInputChange={handleInputChange}
            value={getSingleSelectedItem(field.value)}
            onSelectedChange={(item) => setValue(name, item?.value)}
            {...{
              options,
              label,
              isRequired,
              inputProps,
            }}
          />
        )}
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
