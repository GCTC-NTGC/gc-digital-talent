import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { useIntl } from "react-intl";
import { ChangeEvent } from "react";
import get from "lodash/get";
import { tv } from "tailwind-variants";

import { dateMessages } from "@gc-digital-talent/i18n";

import { DateSegment, DATE_SEGMENT, RoundingMethod } from "./types";
import {
  getMonthOptions,
  getMonthSpan,
  setComputedValue,
  splitSegments,
} from "./utils";
import { FieldState } from "../../types";
import Field from "../Field";
import { inputStyles, selectStyles } from "../../styles";

const numberInput = tv({
  extend: inputStyles,
  base: "w-full",
});

const selectInput = tv({
  extend: selectStyles,
  base: "w-full",
});

interface ControlledInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  show: DateSegment[];
  round?: RoundingMethod;
  state: FieldState;
}

const ControlledInput = ({
  field: { onChange, value, name },
  formState: { defaultValues },
  show,
  round,
  state: stateStyles,
}: ControlledInputProps) => {
  const intl = useIntl();
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
    <div className="grid gap-3 xs:grid-cols-[calc(calc(var(--spacing)*24)+4ch)_1fr_calc(calc(var(--spacing)*24)+2ch)]">
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
            min={1900}
            className={numberInput({ state: stateStyles })}
          />
        </div>
      )}
      {show.includes(DATE_SEGMENT.Month) && (
        <div className={getMonthSpan(show)}>
          <Field.Label htmlFor={ID.MONTH}>
            {intl.formatMessage(dateMessages.month)}
          </Field.Label>
          <select
            id={ID.MONTH}
            name={ID.MONTH}
            onChange={handleMonthChange}
            defaultValue={month ?? ""}
            className={selectInput({ state: stateStyles })}
          >
            <option className="text-gray-600/70 dark:text-gray-300/70" value="">
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
            className={numberInput({ state: stateStyles })}
          />
        </div>
      )}
    </div>
  );
};

export default ControlledInput;
