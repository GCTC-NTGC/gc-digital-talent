import * as React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";

import Field from "../Field";
import type { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";

export type Radio = {
  value: string | number;
  label: string | React.ReactNode;
  contentBelow?: React.ReactNode;
};

type ColumnRange = 1 | 2 | 3 | 4;

export type RadioGroupProps = Omit<CommonInputProps, "id" | "label"> &
  HTMLFieldsetProps & {
    /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
    idPrefix: string;
    /** Holds text for the legend associated with the RadioGroup fieldset. */
    legend: React.ReactNode;
    /** A list of value and label representing the Radios shown.
     * The form will represent the data at `name` as a string containing the chosen value. */
    items: Radio[];
    /** If set to the value of an input element that element will start selected */
    defaultSelected?: string;
    /** If true, all input elements in this fieldset will be disabled. */
    disabled?: boolean;
    /** The number of columns to display options in */
    columns?: ColumnRange;
    /** ID of a field description (help text) */
    describedBy?: string;
  };

const columnMap = new Map<ColumnRange, Record<string, string>>([
  [1, { "data-h2-grid-template-columns": "base(repeat(1, 1fr))" }],
  [
    2,
    {
      "data-h2-grid-template-columns":
        "base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))",
    },
  ],
  [
    3,
    {
      "data-h2-grid-template-columns":
        "base(repeat(1, 1fr)) l-tablet(repeat(3, 1fr))",
    },
  ],
  [
    4,
    {
      "data-h2-grid-template-columns":
        "base(repeat(1, 1fr)) l-tablet(repeat(4, 1fr))",
    },
  ],
]);

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
  defaultSelected,
  columns = 1,
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
  const baseStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id: idPrefix,
    describedBy,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const columnStyles = columnMap.get(columns) ?? {};

  return (
    <Field.Wrapper>
      <Field.Fieldset
        id={idPrefix}
        aria-describedby={ariaDescribedBy}
        {...{ ...baseStyles, ...stateStyles }}
        {...rest}
      >
        <Field.Legend required={!!rules.required}>{legend}</Field.Legend>
        <div
          data-h2-display="base(grid)"
          data-h2-gap="base(x.25)"
          {...columnStyles}
        >
          {items.map(({ value, label, contentBelow }) => {
            const id = `${idPrefix}-${value}`;
            return (
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                key={value}
              >
                <Field.Label
                  key={value}
                  data-h2-font-size="base(copy)"
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(flex-start)"
                  data-h2-gap="base(0 x.25)"
                >
                  <input
                    id={id}
                    {...register(name, rules)}
                    value={value}
                    type="radio"
                    defaultChecked={defaultSelected === value}
                    {...(contentBelow && {
                      "aria-describedby": `${id}-content-below`,
                    })}
                  />
                  <span data-h2-margin-top="base(-x.125)">{label}</span>
                </Field.Label>
                {contentBelow && (
                  <div id={`${id}-content-below`}>{contentBelow}</div>
                )}
              </div>
            );
          })}
        </div>
      </Field.Fieldset>
      <Field.Descriptions ids={descriptionIds} {...{ error, context }} />
    </Field.Wrapper>
  );
};

export default RadioGroup;
