import React from "react";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";

import { useIntl } from "react-intl";
import InputUnsaved from "../inputPartials/InputUnsaved/InputUnsaved";
import { useFieldState, useFieldStateStyles } from "../../helpers/formUtils";
import { Scalars } from "../../api/generated";

import Actions from "./Actions";
import Label from "./Label";

import { InputError } from "../inputPartials";

interface Option {
  value: string;
  label: React.ReactNode;
}

export interface ComboboxProps
  extends Omit<
    React.HTMLProps<HTMLInputElement>,
    "capture" | "type" | "label"
  > {
  id: string;
  name: string;
  label: React.ReactNode;
  context?: string;
  rules?: RegisterOptions;
  hideOptional?: boolean;
  trackUnsaved?: boolean;
  options: Option[];
  multiple?: boolean;
}

const Combobox = ({
  id,
  label,
  name,
  rules = {},
  readOnly,
  hideOptional,
  trackUnsaved = true,
  options,
}: ComboboxProps) => {
  const intl = useIntl();
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
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(name || "", !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const error = errors[name]?.message as FieldError;
  const isRequired = !!rules?.required;

  // TODO: Make this filter much smarter, possibly fuse.js
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label
            ?.toLocaleString()
            .toLowerCase()
            .includes(query.toLowerCase()),
        );
  const noOptions = query !== "" && filteredOptions.length === 0;

  const helpId = `${id}-error`;

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const handleClear = () => {
    setSelectedOption(null);
  };

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
      data-h2-align-items="base(flex-start)"
      nullable
    >
      <div data-h2-position="base(relative)" data-h2-width="base(100%)">
        <Label hideOptional={hideOptional} required={isRequired}>
          {label}
        </Label>
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
            onChange={handleChange}
            onBlur={inputProps.onBlur}
            displayValue={getDisplayValue}
            {...stateStyles}
            data-h2-padding="base(x.25, x1.25, x.25, x.5)"
            data-h2-radius="base(input)"
            data-h2-width="base(100%)"
            {...(readOnly && {
              "data-h2-background-color": "base(light.dt-gray)",
            })}
          />
          <Actions
            showClear={!!selectedOption}
            onClear={handleClear}
            clearLabel={intl
              .formatMessage(
                {
                  defaultMessage: "Reset {label}",
                  id: "b3ar1X",
                  description: "Button text to reset the combobox input",
                },
                { label },
              )
              .toString()}
          />
        </div>
        <ComboboxPrimitive.Options
          data-h2-background-color="base(white)"
          data-h2-border="base(all, 2px, solid, dt-gray)"
          data-h2-shadow="base(l)"
          data-h2-padding="base(x.5)"
          data-h2-radius="base(input)"
          data-h2-max-height="base(24rem)"
          data-h2-position="base(absolute)"
          data-h2-offset="base(100%, 0, auto, 0)"
          data-h2-overflow="base(inherit, auto)"
          as={noOptions ? "div" : "ul"}
        >
          {noOptions && (
            <p
              data-h2-cursor="base(pointer)"
              data-h2-radius="base(input)"
              data-h2-padding="base(x.25, x.5)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-gap="base(x.25, 0)"
            >
              {intl.formatMessage({
                defaultMessage: "No results found",
                id: "sfk6tg",
                description:
                  "Message displayed when combobox has no options available",
              })}
            </p>
          )}
          {filteredOptions.map((option) => (
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
                  data-h2-gap="base(x.25, 0)"
                  {...(active
                    ? {
                        "data-h2-background-color": "base(light.dt-gray)",
                      }
                    : {
                        "data-h2-background-color": "base(white)",
                      })}
                >
                  <span>{option.label}</span>
                </li>
              )}
            </ComboboxPrimitive.Option>
          ))}
        </ComboboxPrimitive.Options>
      </div>
      <InputUnsaved isVisible={isUnsaved} id={helpId} />
      {error && <InputError id={helpId} isVisible={!!error} error={error} />}
    </ComboboxPrimitive>
  );
};

export default Combobox;
