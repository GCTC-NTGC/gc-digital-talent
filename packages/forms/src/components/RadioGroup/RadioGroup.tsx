import { useFormContext } from "react-hook-form";
import { useReducedMotion } from "motion/react";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import Field from "../Field";
import type { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import { checkboxRadioStyles, inputStyles } from "../../styles";

const boundingBox = tv({
  extend: inputStyles,
  // NOTE: Remove important in #13664
  base: "gap-0! px-0! py-1.5",
});

const grid = tv({
  base: "grid grid-cols-1 gap-x-1.5",
  variants: {
    columns: {
      1: "",
      2: "xs:grid-cols-2",
      3: "sm:grid-cols-3",
      4: "xs:grid-cols-2 sm:grid-cols-4",
    },
  },
});

const radio = tv({
  extend: checkboxRadioStyles,
  slots: {
    label: "flex cursor-pointer items-start gap-1.5 px-3 py-1.5",
    input: "rounded-full align-middle before:rounded-full",
    desc: "pr-3 pl-11.25 text-sm text-gray-600 dark:text-gray-200",
  },
});

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
  const shouldReduceMotion = useReducedMotion();
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

  const {
    input,
    label: labelStyles,
    desc,
  } = radio({ shouldReduceMotion: shouldReduceMotion ?? false });

  return (
    <Field.Wrapper>
      <Field.Fieldset
        id={idPrefix}
        aria-describedby={ariaDescribedBy}
        {...rest}
      >
        <Field.Legend required={!!rules.required}>{legend}</Field.Legend>
        <Field.BoundingBox className={boundingBox({ state: fieldState })}>
          <div className={grid({ columns })}>
            {items.map(({ value, label, contentBelow }) => {
              const id = `${idPrefix}-${value}`;
              return (
                <div className="flex flex-col" key={value}>
                  <Field.Label key={value} className={labelStyles()}>
                    <input
                      id={id}
                      {...register(name, rules)}
                      value={value}
                      type="radio"
                      disabled={disabled}
                      defaultChecked={defaultSelected === value}
                      className={input()}
                      {...(contentBelow && {
                        "aria-describedby": `${id}-content-below`,
                      })}
                    />
                    <span className="align-middle text-base/6">{label}</span>
                  </Field.Label>
                  {contentBelow && (
                    <div id={`${id}-content-below`} className={desc()}>
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
