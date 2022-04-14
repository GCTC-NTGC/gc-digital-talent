import * as React from "react";
import get from "lodash/get";
import { RegisterOptions, useFormContext } from "react-hook-form";
import Checkbox from "../Checkbox";
import { InputWrapper, Fieldset } from "../../inputPartials";

export type Checkbox = {
  value: string | number;
  label: string | React.ReactNode;
};

export interface ChecklistProps {
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
  context?: string;
  /** If true, all input elements in this fieldset will be disabled. */
  disabled?: boolean;
  /** If true, and this input is not required, 'Optional' will not be shown above the fieldset. */
  hideOptional?: boolean;
}

/**
 * Must be part of a form controlled by react-hook-form.
 * The form will represent the data at `name` as an array, containing the values of the checked boxes.
 */
export const Checklist: React.FunctionComponent<ChecklistProps> = ({
  idPrefix,
  legend,
  name,
  items,
  rules = {},
  context,
  disabled,
  hideOptional,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message;
  const required = !!rules.required;

  return (
    <Fieldset
      legend={legend}
      name={name}
      required={required}
      error={error}
      context={context}
      disabled={disabled}
      hideOptional={hideOptional}
    >
      {items.map(({ value, label }) => {
        const id = `${idPrefix}-${value}`;
        return (
          <InputWrapper
            key={id}
            inputId={id}
            label={label}
            // Don't show Required tag, error or context on individual input, as its handled by Fieldset.
            required={false}
            hideOptional
            data-h2-flex-direction="b(row)"
            data-h2-align-items="b(center)"
          >
            <input
              style={{ order: -1 }}
              data-h2-margin="b(bottom-right, xxs)"
              id={id}
              {...register(name, rules)}
              value={value}
              type="checkbox"
              aria-invalid={error ? "true" : "false"}
            />
          </InputWrapper>
        );
      })}
    </Fieldset>
  );
};

export default Checklist;
