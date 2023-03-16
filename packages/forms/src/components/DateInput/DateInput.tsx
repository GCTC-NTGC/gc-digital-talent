import React from "react";
import { useIntl } from "react-intl";
import get from "lodash/get";
import omit from "lodash/omit";
import { isAfter, isBefore, isValid } from "date-fns";
import { FieldError, useFormContext, Controller } from "react-hook-form";

import { errorMessages } from "@gc-digital-talent/i18n";
import { formDateStringToDate } from "@gc-digital-talent/date-helpers";

import useFieldState from "../../hooks/useFieldState";
import Fieldset from "../Fieldset";
import ControlledInput from "./ControlledInput";
import { DateRegisterOptions, DateSegment, DATE_SEGMENT } from "./types";
import { splitSegments } from "./utils";

export interface DateInputProps extends React.HTMLProps<HTMLFieldSetElement> {
  /** Holds text for the legend associated with the RadioGroup fieldset. */
  legend: React.ReactNode;
  /** The name of this form control.
   * The form's value at this key should be of type Array<string|number>. */
  name: string;
  /** Set of validation rules and error messages to impose on all input elements. */
  rules?: DateRegisterOptions;
  /** If a context string is provided, a small button will appear which, when toggled, shows the context string below the inputs. */
  context?: string;
  /** If true, all input elements in this fieldset will be disabled. */
  disabled?: boolean;
  /** If true, and this input is not required, 'Optional' will not be shown above the fieldset. */
  hideOptional?: boolean;
  /** If true, the legend will be hidden */
  hideLegend?: boolean;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
  /** Select which segments are visible to the user */
  show?: Array<DateSegment>;
}

/**
 * Must be part of a form controlled by react-hook-form.
 * The form will represent the data at `name` as an array, containing the values of the checked boxes.
 */
const DateInput: React.FunctionComponent<DateInputProps> = ({
  legend,
  name,
  rules = {},
  context,
  disabled,
  hideOptional,
  hideLegend,
  show = [DATE_SEGMENT.Year, DATE_SEGMENT.Month, DATE_SEGMENT.Day],
  trackUnsaved = true,
  ...rest
}) => {
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

  const isValidDate = (value: string) => {
    const { year, month, day } = splitSegments(value);
    const isOptionalAndEmpty = !rules.required && !year && !month && !day;
    return (
      isValid(formDateStringToDate(value)) ||
      isOptionalAndEmpty ||
      intl.formatMessage(errorMessages.invalidDate)
    );
  };

  const isAfterMin = (value: string) => {
    if (!rules.min) {
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

    const currentDate = formDateStringToDate(value);
    const maxDate = formDateStringToDate(rules.max.value);
    return isBefore(currentDate, maxDate) || rules.max.message;
  };

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
      flat
      {...rest}
    >
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
    </Fieldset>
  );
};

export default DateInput;
