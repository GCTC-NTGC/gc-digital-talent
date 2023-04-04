import * as React from "react";
import get from "lodash/get";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";

import useFieldState from "../../hooks/useFieldState";
import Fieldset from "../Fieldset";
import InputWrapper from "../InputWrapper";

import Checkbox from "../Checkbox";

export type Checkbox = {
  value: string | number;
  label: string | React.ReactNode;
};

export interface ChecklistProps extends React.HTMLProps<HTMLFieldSetElement> {
  /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
  idPrefix: string;
  /** Holds text for the legend associated with the checklist fieldset. */
  legend: string;
  /** The name of this form control.
   * The form's value at this key should be of type Array<string|number>. */
  name: string;
  /** A list of value and label representing the checkboxes shown.
   * The form will represent the data at `name` as an array containing the values of the checked boxes. */
  items: Checkbox[];
  /** Set of validation rules and error messages to impose on all input elements. */
  rules?: RegisterOptions;
  /** If a context string is provided, a small button will appear which, when toggled, shows the context string below the inputs. */
  context?: string | React.ReactNode;
  /** If true, all input elements in this fieldset will be disabled. */
  disabled?: boolean;
  /** If true, and this input is not required, 'Optional' will not be shown above the fieldset. */
  hideOptional?: boolean;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
}

/**
 * Must be part of a form controlled by react-hook-form.
 * The form will represent the data at `name` as an array, containing the values of the checked boxes.
 */
const Checklist = ({
  idPrefix,
  legend,
  name,
  items,
  rules = {},
  context,
  disabled,
  hideOptional,
  trackUnsaved = true,
  ...rest
}: ChecklistProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const required = !!rules.required;
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;

  return (
    <Fieldset
      legend={legend}
      name={name}
      required={required}
      error={error}
      context={context}
      disabled={disabled}
      hideOptional={hideOptional}
      trackUnsaved={trackUnsaved}
      isUnsaved={isUnsaved}
      {...rest}
    >
      {items.map(({ value, label }) => {
        const id = `${idPrefix}-${value}`;
        return (
          <InputWrapper
            key={id}
            inputId={id}
            label={label}
            labelSize="copy"
            // Don't show Required tag, error or context on individual input, as its handled by Fieldset.
            required={false}
            hideOptional
            data-h2-margin="base(x.25, 0, 0, 0)"
            data-h2-flex-direction="base(row)"
          >
            <input
              data-h2-order="base(-1)"
              data-h2-margin="base(3px, x.5, 0, 0)"
              id={id}
              {...register(name, rules)}
              value={value}
              type="checkbox"
              aria-required={rules.required ? "true" : undefined}
              aria-invalid={error ? "true" : "false"}
            />
          </InputWrapper>
        );
      })}
    </Fieldset>
  );
};

export default Checklist;
