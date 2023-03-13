import type { IntlShape } from "react-intl";
// Note: ignore to stop merging date-fns imports
// eslint-disable-next-line import/no-duplicates
import { add, format, getDaysInMonth, isDate, parseISO } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { fr } from "date-fns/locale";
import { formatInTimeZone, toDate } from "date-fns-tz";

import { Scalars } from "@gc-digital-talent/graphql";
import { getLocale } from "@gc-digital-talent/i18n";

import {
  FormatDateOptions,
  SeparatedDateRange,
  SeparatedDateString,
} from "./types";
import {
  DATETIME_FORMAT_STRING,
  DATE_FORMAT_STRING,
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "./const";

export {
  DATETIME_FORMAT_STRING,
  DATE_FORMAT_STRING,
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
};

/**
 * Returns the current date in the format YYYY-MM-DD.
 * @returns string
 */
export const currentDate = (): string => new Date().toISOString().slice(0, 10);

/**
 * Format a date in given format and locale, optionally in a different time zone
 * @returns String in the given format
 */
export const formatDate = ({
  date,
  formatString,
  intl,
  timeZone,
}: FormatDateOptions): string => {
  const strLocale = getLocale(intl);
  const locale = strLocale === "fr" ? fr : undefined;

  // A date formatting function that can use time zones optionally
  const result = timeZone
    ? formatInTimeZone(date, timeZone, formatString, { locale })
    : format(date, formatString, { locale });

  return result;
};

// parameters for the relativeClosingDate function
export type relativeClosingDateOptions = {
  closingDate: Date;
  now?: Date;
  intl: IntlShape;
  timeZone?: string;
};

/**
 * Calculate a friendly date/time string, optionally in a different time zone
 * @returns string of formatted date
 */
export const relativeClosingDate = ({
  closingDate,
  now = new Date(),
  intl,
  timeZone,
}: relativeClosingDateOptions): string => {
  // A date formatting function that can use time zones optionally
  const myFormatFunc = timeZone
    ? (date: Date, formatPattern: string, options?: { locale?: Locale }) =>
        formatInTimeZone(date, timeZone, formatPattern, options)
    : (date: Date, formatPattern: string, options?: { locale?: Locale }) =>
        format(date, formatPattern, options);

  const strLocale = getLocale(intl);
  const locale = strLocale === "fr" ? fr : undefined;
  const time = myFormatFunc(closingDate, `pp`, {
    locale,
  });
  const dateTime = myFormatFunc(closingDate, `PPP p`, {
    locale,
  });

  if (now > closingDate) {
    return intl.formatMessage({
      defaultMessage: "The deadline for submission has passed.",
      id: "8WC+Ty",
      description: "Message displayed when a closing date has passed.",
    });
  }

  if (
    myFormatFunc(now, DATE_FORMAT_STRING) ===
    myFormatFunc(closingDate, DATE_FORMAT_STRING)
  ) {
    return intl.formatMessage(
      {
        defaultMessage: "Closes today at {time}",
        id: "jy7itR",
        description: "Text displayed when relative date is today.",
      },
      {
        time,
      },
    );
  }

  if (
    myFormatFunc(add(now, { days: 1 }), DATE_FORMAT_STRING) ===
    myFormatFunc(closingDate, DATE_FORMAT_STRING)
  ) {
    return intl.formatMessage(
      {
        defaultMessage: "Closes tomorrow at {time}",
        id: "GqmxO8",
        description: "Text displayed when relative date is tomorrow.",
      },
      { time },
    );
  }

  return dateTime;
};

export const strToFormDate = (value: string) => {
  const parsed = parseISO(value);

  return format(parsed, DATE_FORMAT_STRING);
};

// Convert a DateTime from one zone to another
export const convertDateTimeZone = (
  sourceDateTime: Scalars["DateTime"],
  sourceTimeZone: string,
  targetTimeZone: string,
  targetFormatString?: string,
): Scalars["DateTime"] => {
  const dateObject = toDate(sourceDateTime, { timeZone: sourceTimeZone });
  const scalarDateTime = formatInTimeZone(
    dateObject,
    targetTimeZone,
    targetFormatString ?? DATETIME_FORMAT_STRING,
  );
  return scalarDateTime;
};

// Convert a DateTime scalar to a Date by stripping off the time
export const convertDateTimeToDate = (
  d: Scalars["DateTime"],
): Scalars["Date"] => {
  return d.substring(0, DATE_FORMAT_STRING.length);
};

// Parse an API scalar DateTime as UTC to a native Date object
export const parseDateTimeUtc = (d: Scalars["DateTime"]): Date =>
  toDate(d, { timeZone: "UTC" });

export const dateTimeToSeparatedStrings = (
  d?: Scalars["DateTime"],
): SeparatedDateString | null => {
  const parsedDate = d ? strToFormDate(d) : false;
  if (parsedDate) {
    const separated = parsedDate.split("-"); // YYYY-MM-DD
    return {
      year: separated[0],
      month: separated[1],
      day: separated[2],
    };
  }

  return null;
};

export const dateRangeToSeparatedStrings = (
  min?: Scalars["DateTime"],
  max?: Scalars["DateTime"],
): SeparatedDateRange => {
  return {
    min: dateTimeToSeparatedStrings(min),
    max: dateTimeToSeparatedStrings(max),
  };
};

export const getDaysInMonthFromString = (
  d?: Scalars["DateTime"],
): number | null => {
  const parsedDate = d ? parseDateTimeUtc(d) : false;
  if (parsedDate && isDate(parsedDate)) {
    return getDaysInMonth(parsedDate);
  }

  return null;
};
