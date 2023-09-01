/* eslint-disable import/no-duplicates */
// known issue with date-fns and eslint https://github.com/date-fns/date-fns/issues/1756#issuecomment-624803874
import React from "react";
import { useIntl } from "react-intl";
import get from "lodash/get";
import omit from "lodash/omit";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import isValid from "date-fns/isValid";
import { FieldError, useFormContext, Controller } from "react-hook-form";

import { errorMessages } from "@gc-digital-talent/i18n";
import { formDateStringToDate } from "@gc-digital-talent/date-helpers";

import Field from "../Field";
import { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import ControlledInput from "./ControlledInput";
import { splitSegments } from "./utils";
import { DateRegisterOptions, DateSegment, DATE_SEGMENT } from "./types";

export type DateInputProps = Omit<CommonInputProps, "rules" | "label"> &
  HTMLFieldsetProps & {
    /** Holds text for the legend associated with the RadioGroup fieldset. */
    legend: React.ReactNode;
    /** If true, the legend will be hidden */
    hideLegend?: boolean;
    /** Set of validation rules and error messages to impose on all input elements. */
    rules?: DateRegisterOptions;
    /** Select which segments are visible to the user */
    show?: Array<DateSegment>;
  };

/**
 * Must be part of a form controlled by react-hook-form.
 * The form will represent the data at `name` as an array, containing the values of the checked boxes.
 */
const DateInput = ({
  id,
  legend,
  name,
  rules = {},
  context,
  hideLegend,
  show = [DATE_SEGMENT.Year, DATE_SEGMENT.Month, DATE_SEGMENT.Day],
  trackUnsaved = true,
  ...rest
}: DateInputProps) => {
  const intl = useIntl();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const required = !!rules.required;
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const isValidDate = (value: string) => {
    const { year, month, day } = splitSegments(value);
    const isOptionalAndEmpty = !rules.required && !year && !month && !day;

    return (
      isOptionalAndEmpty ||
      isValid(formDateStringToDate(value)) ||
      intl.formatMessage(errorMessages.invalidDate)
    );
  };

  const isAfterMin = (value: string) => {
    if (!rules.min) {
      return true;
    }
    if (!value) {
      return true;
    }

    const currentDate = formDateStringToDate(value);
    const minDate = formDateStringToDate(rules.min.value);
    return isAfter(currentDate, minDate) || rules.min.message;
  };

  const isBeforeMax = (value: string) => {
    if (!rules.max) {
      return true;
    }
    if (!value) {
      return true;
    }

    const currentDate = formDateStringToDate(value);
    const maxDate = formDateStringToDate(rules.max.value);
    return isBefore(currentDate, maxDate) || rules.max.message;
  };

  return (
    <Field.Wrapper>
      <Field.Fieldset aria-describedby={ariaDescribedBy} {...rest}>
        <Field.Legend
          required={required}
          data-h2-font-size="base(copy)"
          data-h2-font-weight="base(700)"
          {...(hideLegend && {
            "data-h2-visually-hidden": "base(invisible)",
          })}
        >
          {legend}
        </Field.Legend>
        <Field.BoundingBox flat>
          <Controller
            control={control}
            name={name}
            rules={{
              ...omit(rules, "min", "max"),
              validate: {
                isValidDate,
                isAfterMin,
                isBeforeMax,
              },
            }}
            render={(props) => <ControlledInput {...props} show={show} />}
          />
        </Field.BoundingBox>
      </Field.Fieldset>
      <Field.Descriptions ids={descriptionIds} {...{ error, context }} />
    </Field.Wrapper>
  );
};

export default DateInput;
