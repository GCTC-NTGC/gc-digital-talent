import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { useIntl } from "react-intl";
import { ChangeEvent } from "react";
import get from "lodash/get";

import { dateMessages } from "@gc-digital-talent/i18n";

import { useInputStylesDeprecated } from "../../hooks/useInputStyles";
import { DateSegment, DATE_SEGMENT, RoundingMethod } from "./types";
import {
  getMonthOptions,
  getMonthSpan,
  setComputedValue,
  splitSegments,
} from "./utils";
import { StyleRecord } from "../../types";
import Field from "../Field";

interface ControlledInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  show: DateSegment[];
  stateStyles: StyleRecord;
  round?: RoundingMethod;
}

const ControlledInput = ({
  field: { onChange, value, name },
  formState: { defaultValues },
  show,
  round,
  stateStyles,
}: ControlledInputProps) => {
  const intl = useIntl();
  const inputStyles = useInputStylesDeprecated();
  const selectStyles = useInputStylesDeprecated("select");
  const rawDefaultValue: unknown = get(defaultValues, name);
  const defaultValue =
    rawDefaultValue !== null && rawDefaultValue !== undefined
      ? // It's a input field so it should be stringable
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        String(rawDefaultValue)
      : undefined;
  const { year, month, day } = splitSegments(defaultValue);
  const ID = {
    YEAR: `${name}Year`,
    MONTH: `${name}Month`,
    DAY: `${name}Day`,
  };

  const handleChange = (segmentValue: string, segment: DateSegment) => {
    const newValue = setComputedValue({
      initialValue: value ? String(value) : undefined,
      value: segmentValue,
      segment,
      show,
      round,
    });

    onChange(newValue);
  };

  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newYear } = e.target;
    handleChange(newYear ? newYear.padStart(4, "0") : "", DATE_SEGMENT.Year);
  };

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: newMonth } = e.target;
    handleChange(newMonth ? newMonth.padStart(2, "0") : "", DATE_SEGMENT.Month);
  };

  const handleDayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newDay } = e.target;
    handleChange(newDay ? newDay.padStart(2, "0") : "", DATE_SEGMENT.Day);
  };

  const months = getMonthOptions(intl);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) p-tablet(calc(x4 + 4ch) 1fr calc(x4 + 2ch))"
      data-h2-gap="base(x.5)"
    >
      {show.includes(DATE_SEGMENT.Year) && (
        <div>
          <Field.Label htmlFor={ID.YEAR}>
            {intl.formatMessage(dateMessages.year)}
          </Field.Label>
          <input
            id={ID.YEAR}
            name={ID.YEAR}
            type="number"
            onChange={handleYearChange}
            defaultValue={year}
            placeholder={intl.formatMessage(dateMessages.yearPlaceholder)}
            data-h2-width="base(100%)"
            min={1900}
            {...inputStyles}
            {...stateStyles}
          />
        </div>
      )}
      {show.includes(DATE_SEGMENT.Month) && (
        <div {...getMonthSpan(show)}>
          <Field.Label htmlFor={ID.MONTH}>
            {intl.formatMessage(dateMessages.month)}
          </Field.Label>
          <select
            id={ID.MONTH}
            name={ID.MONTH}
            onChange={handleMonthChange}
            defaultValue={month ?? ""}
            data-h2-width="base(100%)"
            {...selectStyles}
            {...stateStyles}
          >
            <option data-h2-color="base(gray.dark)" value="">
              {intl.formatMessage(dateMessages.selectAMonth)}
            </option>
            {months.map((monthName, index) => (
              <option value={`${index + 1}`.padStart(2, "0")} key={monthName}>
                {monthName}
              </option>
            ))}
          </select>
        </div>
      )}
      {show.includes(DATE_SEGMENT.Day) && (
        <div>
          <Field.Label htmlFor={ID.DAY}>
            {intl.formatMessage(dateMessages.day)}
          </Field.Label>
          <input
            id={ID.DAY}
            name={ID.DAY}
            type="number"
            onChange={handleDayChange}
            defaultValue={day}
            max={31}
            min={1}
            placeholder={intl.formatMessage(dateMessages.dayPlaceholder)}
            data-h2-width="base(100%)"
            {...inputStyles}
            {...stateStyles}
          />
        </div>
      )}
    </div>
  );
};

export default ControlledInput;
