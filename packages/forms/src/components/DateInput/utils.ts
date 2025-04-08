import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { IntlShape } from "react-intl";
import { getDaysInMonth } from "date-fns/getDaysInMonth";

import { dateMessages } from "@gc-digital-talent/i18n";

import {
  DateSegment,
  DATE_SEGMENT,
  SegmentObject,
  RoundingMethod,
} from "./types";

/**
 * Split the form value into each segment
 *
 * @param value string|undefined  The inputs value
 * @returns SegmentObject         An object that contains keys for each segment
 */
export const splitSegments = (value?: string): SegmentObject => {
  if (!value) {
    return {};
  }

  const [year, month, day] = value.split("-");

  return {
    year,
    month,
    day,
  };
};

/**
 * Different values used to compute a
 * final segment value
 */
interface ComputedSegmentValues {
  // The new value (if we are updating this segment)
  new: string | null;
  // The current value if it exists
  current?: string;
  // A default value to set if the others do not exist
  default: string;
}

interface GetComputedSegmentValueArgs {
  values: ComputedSegmentValues;
  // If this specific segment is being shown
  show: boolean;
}

type GetComputedSegmentValue = (args: GetComputedSegmentValueArgs) => string;

/**
 * Get a value of a specific segment
 *
 * Computes the value based on the current state of
 * the input
 *
 * @param args GetComputedSegmentValueArgs
 * @returns string
 */
const getComputedSegmentValue: GetComputedSegmentValue = ({ values, show }) => {
  if (values.new !== null) {
    return values.new;
  }

  if (!show || values.current) {
    return values.current ?? values.default;
  }

  return "";
};

interface SetComputedValueArgs {
  // The full initial value
  initialValue?: string;
  show: DateSegment[];
  segment: DateSegment;
  value: string | null;
  round?: RoundingMethod;
}

type SetComputedValueFunc = (args: SetComputedValueArgs) => string | undefined;

/**
 * Sets a segment value, updating the entire date
 *
 * @param args  SetComputedValueArgs
 * @returns string
 */
export const setComputedValue: SetComputedValueFunc = ({
  initialValue,
  value,
  segment,
  show,
  round,
}) => {
  const { year, month, day } = splitSegments(initialValue);

  const defaultYear = format(new Date(), "yyyy");
  const newYear = getComputedSegmentValue({
    values: {
      new: segment === DATE_SEGMENT.Year ? value : null,
      current: year,
      default: defaultYear,
    },
    show: show.includes(DATE_SEGMENT.Year),
  });

  let defaultMonth = "01";
  if (!show.includes(DATE_SEGMENT.Month) && round) {
    defaultMonth = "12";
  }
  const newMonth = getComputedSegmentValue({
    values: {
      new: segment === DATE_SEGMENT.Month ? value : null,
      current: month,
      default: defaultMonth,
    },
    show: show.includes(DATE_SEGMENT.Month),
  });

  let defaultDay = "01";
  if (!show.includes(DATE_SEGMENT.Day) && round) {
    if (round === "ceil") {
      const currentDay = parse(
        `${newYear || defaultYear}-${newMonth || defaultMonth}-${defaultDay}`,
        "yyyy-MM-dd",
        new Date(),
      );
      defaultDay = String(getDaysInMonth(currentDay));
    }
  }
  const newDay = getComputedSegmentValue({
    values: {
      new: segment === DATE_SEGMENT.Day ? value : null,
      current: day,
      default: defaultDay,
    },
    show: show.includes(DATE_SEGMENT.Day),
  });

  if (!newYear && !newMonth && !newDay) {
    return "";
  }

  return [newYear, newMonth, newDay].join("-");
};

/**
 * Get the column span attribute for the month
 * select input based on what other items are
 * being shown to the user
 *
 * @param show  Array<DateSegment>
 * @returns Record<string, string>
 */
export const getMonthSpan = (show: DateSegment[]) => {
  let monthSpan = {
    "data-h2-grid-column": "p-tablet(2 / span 1)",
  };
  if (!show.includes(DATE_SEGMENT.Year)) {
    monthSpan = {
      "data-h2-grid-column": "p-tablet(1 / span 2)",
    };
  }
  if (!show.includes(DATE_SEGMENT.Day)) {
    monthSpan = {
      "data-h2-grid-column": "p-tablet(2 / span 2)",
    };
  }
  if (!show.includes(DATE_SEGMENT.Day) && !show.includes(DATE_SEGMENT.Year)) {
    monthSpan = {
      "data-h2-grid-column": "p-tablet(1 / span 3)",
    };
  }

  return monthSpan;
};

/**
 * Array of the names of the months
 * in order (used by the month select)
 *
 * @param intl IntlShape
 * @returns Array<string>
 */
export const getMonthOptions = (intl: IntlShape) => [
  intl.formatMessage(dateMessages.january),
  intl.formatMessage(dateMessages.february),
  intl.formatMessage(dateMessages.march),
  intl.formatMessage(dateMessages.april),
  intl.formatMessage(dateMessages.may),
  intl.formatMessage(dateMessages.june),
  intl.formatMessage(dateMessages.july),
  intl.formatMessage(dateMessages.august),
  intl.formatMessage(dateMessages.september),
  intl.formatMessage(dateMessages.october),
  intl.formatMessage(dateMessages.november),
  intl.formatMessage(dateMessages.december),
];
