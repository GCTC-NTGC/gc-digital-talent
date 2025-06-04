import { useIntl } from "react-intl";
import omit from "lodash/omit";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { isSameDay } from "date-fns/isSameDay";
import { isSameMonth } from "date-fns/isSameMonth";
import { isSameYear } from "date-fns/isSameYear";
import { isValid } from "date-fns/isValid";
import { useFormContext, Controller } from "react-hook-form";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import { errorMessages } from "@gc-digital-talent/i18n";
import { formDateStringToDate } from "@gc-digital-talent/date-helpers";

import Field from "../Field";
import { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import ControlledInput from "./ControlledInput";
import { splitSegments } from "./utils";
import {
  DateRegisterOptions,
  DateSegment,
  DATE_SEGMENT,
  RoundingMethod,
} from "./types";

const legendStyles = tv({
  base: "text-base font-bold",
  variants: { hide: { true: "sr-only" } },
});

export type DateInputProps = Omit<CommonInputProps, "rules" | "label"> &
  HTMLFieldsetProps & {
    /** Holds text for the legend associated with the RadioGroup fieldset. */
    legend: ReactNode;
    /** If true, the legend will be hidden */
    hideLegend?: boolean;
    /** Set of validation rules and error messages to impose on all input elements. */
    rules?: DateRegisterOptions;
    /** Select which segments are visible to the user */
    show?: DateSegment[];
    /** Round the date to the nearest segment */
    round?: RoundingMethod;
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
  round,
  trackUnsaved = true,
  ...rest
}: DateInputProps) => {
  const intl = useIntl();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const required = !!rules.required;
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error: fieldState === "invalid",
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

  // Check for equality only within the scope of available fields
  const isRelativelyEqual = (dateA: Date | number, dateB: Date | number) => {
    if (show.includes(DATE_SEGMENT.Year)) {
      if (show.includes(DATE_SEGMENT.Month)) {
        if (show.includes(DATE_SEGMENT.Day)) {
          return isSameDay(dateA, dateB);
        }
        return isSameMonth(dateA, dateB);
      }
      return isSameYear(dateA, dateB);
    }

    // What is this input actually for?
    return false;
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
    return (
      isAfter(currentDate, minDate) ||
      isRelativelyEqual(currentDate, minDate) ||
      rules.min.message
    );
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
    return (
      isBefore(currentDate, maxDate) ||
      isRelativelyEqual(currentDate, maxDate) ||
      rules.max.message
    );
  };

  return (
    <Field.Wrapper>
      <Field.Fieldset id={id} aria-describedby={ariaDescribedBy} {...rest}>
        <Field.Legend
          required={required}
          className={legendStyles({ hide: hideLegend })}
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
            render={(props) => (
              <ControlledInput
                {...props}
                round={round}
                show={show}
                state={fieldState}
              />
            )}
          />
        </Field.BoundingBox>
      </Field.Fieldset>
      <Field.Descriptions ids={descriptionIds} {...{ errors, name, context }} />
    </Field.Wrapper>
  );
};

export default DateInput;
