import * as React from "react";
import get from "lodash/get";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";

import useFieldState from "../../hooks/useFieldState";
import Fieldset from "../Fieldset";
import InputWrapper from "../InputWrapper";

export type Radio = { value: string | number; label: string | React.ReactNode };

export interface RadioGroupProps extends React.HTMLProps<HTMLFieldSetElement> {
  /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
  idPrefix: string;
  /** Holds text for the legend associated with the RadioGroup fieldset. */
  legend: React.ReactNode;
  /** The name of this form control.
   * The form's value at this key should be of type Array<string|number>. */
  name: string;
  /** A list of value and label representing the Radios shown.
   * The form will represent the data at `name` as a string containing the chosen value. */
  items: Radio[];
  /** Set of validation rules and error messages to impose on all input elements. */
  rules?: RegisterOptions;
  /** If a context string is provided, a small button will appear which, when toggled, shows the context string below the inputs. */
  context?: string;
  /** If true, all input elements in this fieldset will be disabled. */
  disabled?: boolean;
  /** If true, and this input is not required, 'Optional' will not be shown above the fieldset. */
  hideOptional?: boolean;
  /** If set to the value of an input element that element will start selected */
  defaultSelected?: string;
  /** The number of columns to display options in */
  columns?: number;
  /** If true, the legend will be hidden */
  hideLegend?: boolean;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
  /** ID of a field description (help text) */
  describedBy?: string;
}

/**
 * Must be part of a form controlled by react-hook-form.
 * The form will represent the data at `name` as an array, containing the values of the checked boxes.
 */
const RadioGroup = ({
  idPrefix,
  legend,
  name,
  items,
  rules = {},
  context,
  disabled,
  hideOptional,
  defaultSelected,
  columns = 1,
  hideLegend,
  trackUnsaved = true,
  describedBy,
  ...rest
}: RadioGroupProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const required = !!rules.required;
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;

  let columnValue = { "data-h2-flex-item": "base(1of1)" };
  if (columns === 2) {
    columnValue = { "data-h2-flex-item": "base(1of1) p-tablet(1of2)" };
  }

  return (
    <Fieldset
      legend={legend}
      name={name}
      required={required}
      error={error}
      context={context}
      disabled={disabled}
      hideOptional={hideOptional}
      hideLegend={hideLegend}
      trackUnsaved={trackUnsaved}
      isUnsaved={isUnsaved}
      describedBy={describedBy}
      {...rest}
    >
      <div data-h2-flex-grid="base(flex-start, x1, 0)">
        {items.map(({ value, label }) => {
          const id = `${idPrefix}-${value}`;
          return (
            <div {...columnValue} key={id}>
              <InputWrapper
                inputId={id}
                label={label}
                labelSize="copy"
                // Don't show Required tag, error or context on individual input, as its handled by Fieldset.
                required={false}
                trackUnsaved={trackUnsaved}
                hideOptional
                data-h2-flex-direction="base(row)"
                data-h2-margin="base(x.25, 0, 0, 0)"
              >
                <input
                  data-h2-order="base(-1)"
                  data-h2-margin="base(3px, x.5, 0, 0)"
                  id={id}
                  {...register(name, rules)}
                  value={value}
                  type="radio"
                  defaultChecked={defaultSelected === value}
                />
              </InputWrapper>
            </div>
          );
        })}
      </div>
    </Fieldset>
  );
};

export default RadioGroup;
