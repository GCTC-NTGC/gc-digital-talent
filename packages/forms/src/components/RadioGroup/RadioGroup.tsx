import { useFormContext } from "react-hook-form";
import { useReducedMotion } from "motion/react";
import { ReactNode } from "react";

import Field from "../Field";
import type { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import { useInputStylesDeprecated } from "../../hooks/useInputStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import getCheckboxRadioStyles from "../../utils/getCheckboxRadioStyles";

export interface Radio {
  value: string | number;
  label: string | ReactNode;
  contentBelow?: ReactNode;
}

type ColumnRange = 1 | 2 | 3 | 4;

export type RadioGroupProps = Omit<CommonInputProps, "id" | "label"> &
  HTMLFieldsetProps & {
    /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
    idPrefix: string;
    /** Holds text for the legend associated with the RadioGroup fieldset. */
    legend: ReactNode;
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
  disabled,
  ...rest
}: RadioGroupProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const baseStyles = useInputStylesDeprecated();
  const shouldReduceMotion = useReducedMotion();
  const baseRadioStyles = getCheckboxRadioStyles(shouldReduceMotion);
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id: idPrefix,
    describedBy,
    show: {
      error: fieldState === "invalid",
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
        {...rest}
      >
        <Field.Legend required={!!rules.required}>{legend}</Field.Legend>
        <Field.BoundingBox
          {...{ ...baseStyles, ...stateStyles }}
          data-h2-padding="base(x.25 0)"
        >
          <div
            data-h2-display="base(grid)"
            data-h2-gap="base(0 x.25)"
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
                    data-h2-cursor="base(pointer)"
                    data-h2-font-size="base(copy)"
                    data-h2-display="base(flex)"
                    data-h2-align-items="base(flex-start)"
                    data-h2-padding="base(x.25 x.5)"
                    data-h2-gap="base(x.25)"
                  >
                    <input
                      id={id}
                      {...register(name, rules)}
                      value={value}
                      type="radio"
                      disabled={disabled}
                      defaultChecked={defaultSelected === value}
                      data-h2-radius="base(l) base:selectors[::before](l)"
                      data-h2-vertical-align="base(middle)"
                      {...baseRadioStyles}
                      {...(contentBelow && {
                        "aria-describedby": `${id}-content-below`,
                      })}
                    />
                    <span
                      data-h2-font-size="base(body)"
                      data-h2-vertical-align="base(middle)"
                      data-h2-line-height="base(x1)"
                    >
                      {label}
                    </span>
                  </Field.Label>
                  {contentBelow && (
                    <div
                      id={`${id}-content-below`}
                      data-h2-margin-right="base(x.5)"
                      data-h2-padding-left="base(x1.7)"
                      data-h2-color="base(black.light)"
                      data-h2-font-size="base(caption)"
                    >
                      {contentBelow}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Field.BoundingBox>
      </Field.Fieldset>
      <Field.Descriptions ids={descriptionIds} {...{ errors, name, context }} />
    </Field.Wrapper>
  );
};

export default RadioGroup;
