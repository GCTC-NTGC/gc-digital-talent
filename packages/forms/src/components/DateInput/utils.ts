import { dateMessages } from "@gc-digital-talent/i18n";
import { format } from "date-fns";
import { IntlShape } from "react-intl";

import { DateSegment, DATE_SEGMENT } from "./types";

type SegmentObject = {
  year?: string;
  month?: string;
  day?: string;
};

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

type ComputedSegmentValues = {
  // The new value (if we are updating this segment)
  new: string | null;
  // The current value if it exists
  current?: string;
  // A default value to set if the others do not exist
  default: string;
};

type GetComputedSegmentValueArgs = {
  values: ComputedSegmentValues;
  // If this specific segment is being shown
  show: boolean;
};

type GetComputedSegmentValue = (args: GetComputedSegmentValueArgs) => string;

/**
 * Get a value of a specific segment
 *
 * Computes the value based on the current state of
 * the input
 *
 * @param
 * @returns
 */
const getComputedSegmentValue: GetComputedSegmentValue = ({ values, show }) => {
  if (values.new) {
    return values.new;
  }

  if (!show || values.current) {
    return values.current || values.default;
  }

  return "";
};

type SetComputedValueArgs = {
  // The full initial value
  initialValue?: string;
  show: Array<DateSegment>;
  segment: DateSegment;
  value: string;
};

type SetComputedValueFunc = (args: SetComputedValueArgs) => string | undefined;

/**
 * Sets a segment value, updating the entire date
 *
 * @returns string
 */
export const setComputedValue: SetComputedValueFunc = ({
  initialValue,
  value,
  segment,
  show,
}) => {
  const { year, month, day } = splitSegments(initialValue);

  const newYear = getComputedSegmentValue({
    values: {
      new: segment === DATE_SEGMENT.Year ? value : null,
      current: year,
      default: format(new Date(), "yyyy"),
    },
    show: show.includes(DATE_SEGMENT.Year),
  });

  const newMonth = getComputedSegmentValue({
    values: {
      new: segment === DATE_SEGMENT.Month ? value : null,
      current: month,
      default: "01",
    },
    show: show.includes(DATE_SEGMENT.Month),
  });

  const newDay = getComputedSegmentValue({
    values: {
      new: segment === DATE_SEGMENT.Day ? value : null,
      current: day,
      default: "01",
    },
    show: show.includes(DATE_SEGMENT.Day),
  });

  let values: string[] = [];
  if (newYear) {
    values = [...values, newYear];
  }
  if (newMonth) {
    values = [...values, newMonth];
  }
  if (newDay) {
    values = [...values, newDay];
  }

  return values.join("-");
};

export const inputStyles = {
  "data-h2-padding": "base(x.25, x.5)",
  "data-h2-radius": "base(input)",
  "data-h2-width": "base(100%)",
  "data-h2-min-height": "base(40px)",
};

export const getMonthSpan = (show: Array<DateSegment>) => {
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
