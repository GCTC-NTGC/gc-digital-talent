import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import get from "lodash/get";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";

import { dateMessages } from "@gc-digital-talent/i18n";
import { dateRangeToSeparatedStrings } from "@gc-digital-talent/date-helpers";

import { Scalars } from "@gc-digital-talent/graphql";
import useFieldState from "../../hooks/useFieldState";
import Fieldset from "../Fieldset";
import Input from "../Input";
import Select from "../Select";

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

  const dateConstraints = dateRangeToSeparatedStrings(
    dateRange?.min,
    dateRange?.max,
  );

  useEffect(() => {
    setValue(name, `${year}-${month}-${day}`);
  }, [year, month, day, setValue, name]);

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
      {...rest}
    >
      <input type="hidden" {...register(name, { ...rules })} />
      <div
        data-h2-align-items="base(flex-start)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-gap="base(x1, 0) p-tablet(0, x1)"
        data-h2-justify-content="base(flex-start)"
      >
        <div data-h2-flex-grow="base(2)">
          <Input
            type="number"
            id={ID.YEAR}
            name={ID.YEAR}
            label="Year"
            placeholder="YYYY"
            min={dateConstraints?.min?.year ?? 0}
            max={dateConstraints?.max?.year ?? undefined}
            rules={{
              ...rules,
            }}
          />
        </div>
        <div data-h2-flex-shrink="base(0)" data-h2-flex-grow="base(4)">
          <Select
            id={ID.MONTH}
            name={ID.MONTH}
            label="Month"
            doNotSort
            nullSelection={intl.formatMessage(dateMessages.selectAMonth)}
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
        <div data-h2-flex-grow="base(1)">
          <Input
            type="number"
            id={ID.DAY}
            name={ID.DAY}
            label="Day"
            placeholder="DD"
            min={1}
            max={31}
            rules={{
              ...rules,
            }}
          />
        </div>
      </div>
    </Fieldset>
  );
};

export default DateInput;
