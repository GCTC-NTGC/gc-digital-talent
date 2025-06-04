import { useFormContext } from "react-hook-form";
import { Fragment, ReactNode } from "react";
import { tv } from "tailwind-variants";

import Checkbox from "../Checkbox/Checkbox";
import Field from "../Field";
import type { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import { inputStyles } from "../../styles";

export interface CheckboxOption {
  value: string | number;
  label: string | ReactNode;
  contentBelow?: ReactNode;
}

const checkList = tv({
  extend: inputStyles,
  // NOTE: Remove important in #13664
  base: "gap-0 px-0! py-1.5",
});

export type ChecklistProps = Omit<CommonInputProps, "id" | "label"> &
  HTMLFieldsetProps & {
    /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
    idPrefix: string;
    /** Holds text for the legend associated with the checklist fieldset. */
    legend: ReactNode;
    /** A list of value and label representing the checkboxes shown.
     * The form will represent the data at `name` as an array containing the values of the checked boxes. */
    items: CheckboxOption[];
    /** If true, all input elements in this fieldset will be disabled. */
    disabled?: boolean;
  };

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
  trackUnsaved = true,
  ...rest
}: ChecklistProps) => {
  const {
    formState: { errors },
  } = useFormContext();
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id: idPrefix,
    show: {
      error: fieldState === "invalid",
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  return (
    <Field.Wrapper>
      <Field.Fieldset
        id={idPrefix}
        aria-describedby={ariaDescribedBy}
        {...rest}
      >
        <Field.Legend required={!!rules.required}>{legend}</Field.Legend>
        <Field.BoundingBox className={checkList({ state: fieldState })}>
          {items.map(({ value, label, contentBelow }) => {
            const id = `${idPrefix}-${value}`;
            return (
              <Fragment key={id}>
                <Checkbox
                  id={id}
                  name={name}
                  rules={rules}
                  label={label}
                  disabled={disabled}
                  value={value}
                  inCheckList
                  {...(contentBelow && {
                    "aria-describedby": `${id}-content-below`,
                  })}
                />
                {contentBelow && (
                  <div
                    id={`${id}-content-below`}
                    className="pr-3 pl-11.25 text-sm text-gray-600 dark:text-gray-200"
                  >
                    {contentBelow}
                  </div>
                )}
              </Fragment>
            );
          })}
        </Field.BoundingBox>
      </Field.Fieldset>
      <Field.Descriptions ids={descriptionIds} {...{ errors, name, context }} />
    </Field.Wrapper>
  );
};

export default Checklist;
