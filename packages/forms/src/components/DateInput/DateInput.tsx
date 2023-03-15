import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import get from "lodash/get";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";

import { Scalars } from "@gc-digital-talent/graphql";
import { dateMessages } from "@gc-digital-talent/i18n";
import {
  formatDate,
  formDateStringToDate,
} from "@gc-digital-talent/date-helpers";

import useFieldState from "../../hooks/useFieldState";
import Fieldset from "../Fieldset";
import Input from "../Input";
import Select from "../Select";

import getSegmentValues from "./utils";
import getDateValidation from "./validation";
import { DateSegment, DATE_SEGMENT } from "./types";

export interface DateInputProps extends React.HTMLProps<HTMLFieldSetElement> {
  /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
  idPrefix: string;
  /** Holds text for the legend associated with the RadioGroup fieldset. */
  legend: React.ReactNode;
  /** The name of this form control.
   * The form's value at this key should be of type Array<string|number>. */
  name: string;
  /** Set of validation rules and error messages to impose on all input elements. */
  rules?: RegisterOptions;
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
  /** Set a range to constrain the picker to */
  dateRange?: {
    /** Set a minimum date */
    min?: Scalars["Date"];
    /** Set a maximum date */
    max?: Scalars["Date"];
  };
  show?: Array<DateSegment>;
}

/**
 * Must be part of a form controlled by react-hook-form.
 * The form will represent the data at `name` as an array, containing the values of the checked boxes.
 */
const DateInput: React.FunctionComponent<DateInputProps> = ({
  idPrefix,
  legend,
  name,
  rules = {},
  context,
  disabled,
  hideOptional,
  hideLegend,
  dateRange,
  show = [DATE_SEGMENT.Year, DATE_SEGMENT.Month, DATE_SEGMENT.Day],
  trackUnsaved = true,
  ...rest
}) => {
  const intl = useIntl();
  const ID = {
    YEAR: `${idPrefix}Year`,
    MONTH: `${idPrefix}Month`,
    DAY: `${idPrefix}Day`,
  };
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const required = !!rules.required;
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [year, month, day] = watch([ID.YEAR, ID.MONTH, ID.DAY]);

  const dateConstraints = {
    min: dateRange?.min ? formDateStringToDate(dateRange.min) : null,
    max: dateRange?.max ? formDateStringToDate(dateRange.max) : null,
  };

  useEffect(() => {
    const newValue = getSegmentValues({ year, month, day }, show);
    // Updates the hidden input to get a properly formatted date we can validate
    if (newValue) {
      setValue(name, newValue);
    }
  }, [year, month, day, setValue, name, show]);

  let monthSpan = {
    "data-h2-grid-column": "base(2 / span 1)",
  };
  if (!show.includes(DATE_SEGMENT.Year)) {
    monthSpan = {
      "data-h2-grid-column": "base(1 / span 2)",
    };
  }
  if (!show.includes(DATE_SEGMENT.Day)) {
    monthSpan = {
      "data-h2-grid-column": "base(2 / span 2)",
    };
  }
  if (!show.includes(DATE_SEGMENT.Day) && !show.includes(DATE_SEGMENT.Year)) {
    monthSpan = {
      "data-h2-grid-column": "base(1 / span 3)",
    };
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
      flat
      {...rest}
    >
      <input
        type="hidden"
        data-testid="hidden-date"
        {...register(name, {
          ...rules,
          validate: getDateValidation(
            dateConstraints,
            name,
            !!rules.required,
            { year, month, day },
            intl,
          ),
          deps: [ID.YEAR, ID.MONTH, ID.DAY],
        })}
      />
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(100%) p-tablet(calc(x4 + 4ch) 1fr calc(x4 + 2ch))"
        data-h2-gap="base(x.5)"
      >
        {show.includes(DATE_SEGMENT.Year) && (
          <div data-h2-margin="base(-x.75, 0)">
            <Input
              type="number"
              id={ID.YEAR}
              name={ID.YEAR}
              label={intl.formatMessage(dateMessages.year)}
              placeholder="YYYY"
              hideOptional
              trackUnsaved={false}
              min={
                dateConstraints.min
                  ? formatDate({
                      date: dateConstraints.min,
                      formatString: "yyyy",
                      intl,
                    })
                  : 0
              }
              max={
                dateConstraints.max
                  ? formatDate({
                      date: dateConstraints.max,
                      formatString: "yyyy",
                      intl,
                    })
                  : undefined
              }
              rules={{
                min: dateConstraints.min
                  ? parseInt(
                      formatDate({
                        date: dateConstraints.min,
                        formatString: "yyyy",
                        intl,
                      }),
                      10,
                    )
                  : undefined,
                max: dateConstraints.max
                  ? parseInt(
                      formatDate({
                        date: dateConstraints.max,
                        formatString: "yyyy",
                        intl,
                      }),
                      10,
                    )
                  : undefined,
              }}
            />
          </div>
        )}
        {show.includes(DATE_SEGMENT.Month) && (
          <div {...monthSpan} data-h2-margin="base(-x.75, 0)">
            <Select
              id={ID.MONTH}
              name={ID.MONTH}
              label={intl.formatMessage(dateMessages.month)}
              doNotSort
              hideOptional
              nullSelection={intl.formatMessage(dateMessages.selectAMonth)}
              rules={rules}
              trackUnsaved={false}
              options={[
                {
                  value: "01",
                  label: intl.formatMessage(dateMessages.january),
                },
                {
                  value: "02",
                  label: intl.formatMessage(dateMessages.february),
                },
                {
                  value: "03",
                  label: intl.formatMessage(dateMessages.march),
                },
                {
                  value: "04",
                  label: intl.formatMessage(dateMessages.april),
                },
                {
                  value: "05",
                  label: intl.formatMessage(dateMessages.may),
                },
                {
                  value: "06",
                  label: intl.formatMessage(dateMessages.june),
                },
                {
                  value: "07",
                  label: intl.formatMessage(dateMessages.july),
                },
                {
                  value: "08",
                  label: intl.formatMessage(dateMessages.august),
                },
                {
                  value: "09",
                  label: intl.formatMessage(dateMessages.september),
                },
                {
                  value: "10",
                  label: intl.formatMessage(dateMessages.october),
                },
                {
                  value: "11",
                  label: intl.formatMessage(dateMessages.november),
                },
                {
                  value: "12",
                  label: intl.formatMessage(dateMessages.december),
                },
              ]}
            />
          </div>
        )}
        {show.includes(DATE_SEGMENT.Day) && (
          <div data-h2-margin="base(-x.75, 0)">
            <Input
              type="number"
              id={ID.DAY}
              name={ID.DAY}
              label={intl.formatMessage(dateMessages.day)}
              placeholder="DD"
              hideOptional
              trackUnsaved={false}
              min={1}
              max={31}
              rules={rules}
            />
          </div>
        )}
      </div>
    </Fieldset>
  );
};

export default DateInput;
