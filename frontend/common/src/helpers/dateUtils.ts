import type { IntlShape } from "react-intl";
import { add, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { Scalars } from "../api/generated";
import { getLocale } from "./localize";

// https://date-fns.org/docs/format
// Date scalar formatting string
export const DATE_FORMAT_STRING = "yyyy-MM-dd";
// DateTime scalar formatting string
export const DATETIME_FORMAT_STRING = "yyyy-MM-dd HH:mm:ss";

// parameters for the formatDate function
export type FormatDateOptions = {
  date: Date;
  formatString: string;
  intl: IntlShape;
  timeZone?: string;
};

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
export const FAR_FUTURE_DATE = "2999-12-31";
export const FAR_PAST_DATE = "2000-01-01";
export const PAST_DATE = "2020-01-01";

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
