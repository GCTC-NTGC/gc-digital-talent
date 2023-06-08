import React from "react";
import { useIntl } from "react-intl";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import debounce from "lodash/debounce";
import orderBy from "lodash/orderBy";

import { Scalars } from "@gc-digital-talent/graphql";
import { formMessages } from "@gc-digital-talent/i18n";

import { CommonInputProps, HTMLInputProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import InputUnsaved from "../InputUnsaved";
import InputError from "../InputError";

import Actions from "./Actions";
import Label from "./Label";
import NoOptions from "./NoOptions";

import "./combobox.css";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";
import Base from "../Base";

export interface Option {
  /** The data used on form submission  */
  value: string;
  /** Text to display in the list of options */
  label: React.ReactNode;
}

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
  };

const Combobox = ({
  id,
  label,
  name,
  rules = {},
  readOnly,
  trackUnsaved = true,
  onSearch,
  fetching = false,
  isExternalSearch = false,
  options,
  ...rest
}: ComboboxProps) => {
  const intl = useIntl();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedOption, setSelectedOption] = React.useState<
    Scalars["ID"] | null
  >(null);
  const [query, setQuery] = React.useState<string>("");
  const {
    setValue,
    resetField,
    register,
    formState: { errors },
  } = useFormContext();
  const inputProps = register(name, rules);
  const baseStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(name || "", !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const error = errors[name]?.message as FieldError;
  const isRequired = !!rules?.required;

  // TODO: Make this filter much smarter, possibly fuse.js
  const filteredOptions = React.useMemo(() => {
    if (query === "" || isExternalSearch) {
      return options;
    }

    return orderBy(
      options.filter((option) =>
        option.label
          ?.toLocaleString()
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
      (o) => o?.label?.toLocaleString().toLowerCase(),
      "asc",
    );
  }, [query, isExternalSearch, options]);

  const noOptions = fetching || filteredOptions.length === 0;

  const helpId = `${id}-error`;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = e;
      setQuery(value);
      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch],
  );

  const debouncedChangeHandler = React.useMemo(
    () => debounce(handleChange, 300),
    [handleChange],
  );

  React.useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  const handleClear = () => {
    setSelectedOption(null);
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // This does not play well with react-hook-form so
  // we need to manually set the value here
  React.useEffect(() => {
    if (selectedOption !== "") {
      setValue(name, selectedOption);
    } else {
      resetField(name);
    }
  }, [selectedOption, setValue, resetField, name]);

  const getDisplayValue = (value: Scalars["ID"]): string => {
    if (value) {
      const selected = options.find((option) => option.value === value);
      if (selected) {
        return `${selected.label}`;
      }
    }

    return ``;
  };

  return (
    <ComboboxPrimitive
      as="div"
      value={selectedOption}
      onChange={setSelectedOption}
      name={name}
      data-h2-position="base(relative)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      nullable
    >
      <div data-h2-position="base(relative)" data-h2-width="base(100%)">
        <ComboboxPrimitive.Label as={Base.Label} required={isRequired}>
          {label}
        </ComboboxPrimitive.Label>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-grow="base(1)"
          data-h2-width="base(100%)"
          data-h2-position="base(relative)"
          data-h2-margin="base(x.125, 0)"
        >
          <ComboboxPrimitive.Input
            aria-describedby={error || isUnsaved ? helpId : undefined}
            aria-required={rules.required ? "true" : undefined}
            aria-invalid={error ? "true" : "false"}
            autoComplete="off"
            onChange={debouncedChangeHandler}
            onBlur={inputProps.onBlur}
            displayValue={getDisplayValue}
            ref={inputRef}
            {...baseStyles}
            {...stateStyles}
            data-h2-width="base(100%)"
            {...(readOnly
              ? {
                  readOnly: true,
                  "data-h2-background-color": "base(background.dark)",
                }
              : {})}
            {...rest}
          />
          <Actions
            showClear={!!selectedOption || query !== ""}
            onClear={handleClear}
            fetching={fetching}
            clearLabel={intl
              .formatMessage(formMessages.resetCombobox, { label })
              .toString()}
          />
        </div>
        <ComboboxPrimitive.Options
          data-h2-background-color="base(white)"
          data-h2-shadow="base(l)"
          data-h2-max-height="base(24rem)"
          data-h2-position="base(absolute)"
          data-h2-location="base(100%, 0, auto, 0)"
          data-h2-overflow="base(visible auto)"
          {...baseStyles}
          as={noOptions ? "div" : "ul"}
        >
          {noOptions ? (
            <NoOptions fetching={fetching} />
          ) : (
            filteredOptions.map((option) => (
              <ComboboxPrimitive.Option
                key={option.value}
                value={option.value}
                as={React.Fragment}
              >
                {({ active }) => (
                  <li
                    data-h2-cursor="base(pointer)"
                    data-h2-radius="base(input)"
                    data-h2-padding="base(x.25, x.5)"
                    data-h2-display="base(flex)"
                    data-h2-align-items="base(center)"
                    data-h2-gap="base(0, x.25)"
                    {...(active
                      ? {
                          "data-h2-background-color": "base(gray.light)",
                        }
                      : {
                          "data-h2-background-color": "base(white)",
                        })}
                  >
                    <span>{option.label}</span>
                  </li>
                )}
              </ComboboxPrimitive.Option>
            ))
          )}
        </ComboboxPrimitive.Options>
      </div>
      <InputUnsaved isVisible={isUnsaved} id={helpId} />
      {error && <InputError id={helpId} isVisible={!!error} error={error} />}
    </ComboboxPrimitive>
  );
};

export default Combobox;
