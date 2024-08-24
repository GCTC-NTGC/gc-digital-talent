import get from "lodash/get";
import { useFormContext } from "react-hook-form";
import { ReactNode } from "react";

import Checkbox from "../Checkbox";
import Field from "../Field";
import type { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputStyles from "../../hooks/useInputStyles";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";

export type CheckboxOption = {
  value: string | number;
  label: string | ReactNode;
};

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
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message?.toString();
  const baseStyles = useInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id: idPrefix,
    show: {
      error,
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
        <Field.BoundingBox
          {...{ ...baseStyles, ...stateStyles }}
          data-h2-gap="base(0)"
          data-h2-padding="base(x.25 0)"
        >
          {items.map(({ value, label }) => {
            const id = `${idPrefix}-${value}`;
            return (
              <Checkbox
                key={id}
                id={id}
                name={name}
                rules={rules}
                label={label}
                disabled={disabled}
                value={value}
                inCheckList
              />
            );
          })}
        </Field.BoundingBox>
      </Field.Fieldset>
      <Field.Descriptions ids={descriptionIds} {...{ error, context }} />
    </Field.Wrapper>
  );
};

export default Checklist;
