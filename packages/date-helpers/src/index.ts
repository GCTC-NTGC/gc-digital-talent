import type { IntlShape } from "react-intl";
import { add } from "date-fns/add";
import { format, FormatOptions } from "date-fns/format";
import { parse } from "date-fns/parse";
import { parseISO } from "date-fns/parseISO";
import { enCA as en } from "date-fns/locale/en-CA";
import { fr } from "date-fns/locale/fr";
import { Locale } from "date-fns/locale";
import { tz } from "@date-fns/tz";

import { getLocale, dateMessages } from "@gc-digital-talent/i18n";
import { Scalars } from "@gc-digital-talent/graphql";

import { FormatDateOptions } from "./types";
import {
  DATETIME_FORMAT_STRING,
  DATE_FORMAT_STRING,
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
  MAX_DATE,
} from "./const";

export {
  DATETIME_FORMAT_STRING,
  DATE_FORMAT_STRING,
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
  MAX_DATE,
};

/**
 * Returns the current date in the format YYYY-MM-DD.
 * @returns string
 */
export const currentDate = (): string => new Date().toISOString().slice(0, 10);

/**
 * Format a date in given format and locale, optionally in a different time zone
 * If no timezone is provided, the timezone will be priority based:
 *    1. If the timezone is included in the date object (Date, TZDate) that will be used
 *    2. Otherwise, the users local timezone will be used
 *
 * @returns String in the given format
 */
export const formatDate = ({
  date,
  formatString,
  intl,
  timeZone,
}: FormatDateOptions): string => {
  const strLocale = getLocale(intl);
  const locale: Locale = strLocale === "fr" ? fr : en;

  // A date formatting function that can use time zones optionally
  const result = format(date, formatString, {
    locale,
    in: timeZone ? tz(timeZone) : undefined,
  });

  return result;
};

// parameters for the relativeClosingDate function
export interface relativeClosingDateOptions {
  closingDate: Date;
  now?: Date;
  intl: IntlShape;
  timeZone?: string;
  customFormat?: string;
}

/**
 * Calculate a friendly date/time string, optionally in a different time zone
 * @returns string of formatted date
 */
export const relativeClosingDate = ({
  closingDate,
  now = new Date(),
  intl,
  timeZone,
  customFormat,
}: relativeClosingDateOptions): string => {
  const formatOpts: FormatOptions = {
    in: timeZone ? tz(timeZone) : undefined,
  };

  const strLocale = getLocale(intl);
  const locale = strLocale === "fr" ? fr : undefined;
  const time = format(closingDate, `p`, {
    ...formatOpts,
    locale,
  });
  const dateTime = format(closingDate, customFormat ?? `PPP p`, {
    ...formatOpts,
    locale,
  });

  if (now > closingDate) {
    return intl.formatMessage(dateMessages.deadlinePassed);
  }

  if (
    format(now, DATE_FORMAT_STRING, formatOpts) ===
    format(closingDate, DATE_FORMAT_STRING, formatOpts)
  ) {
    return intl.formatMessage(dateMessages.deadlineToday, {
      time,
    });
  }

  if (
    format(add(now, { days: 1 }), DATE_FORMAT_STRING, formatOpts) ===
    format(closingDate, DATE_FORMAT_STRING, formatOpts)
  ) {
    return intl.formatMessage(dateMessages.deadlineTomorrow, { time });
  }

  return dateTime;
};

export const strToFormDate = (value: string) => {
  const parsed = parseISO(value);

  return format(parsed, DATE_FORMAT_STRING);
};

export const formDateStringToDate = (value: string, fallback?: Date) => {
  return parse(value, DATE_FORMAT_STRING, fallback ?? new Date());
};

export const formDateTimeStringToDate = (value: string, fallback?: Date) => {
  return parse(value, DATETIME_FORMAT_STRING, fallback ?? new Date());
};

// Convert a DateTime from one zone to another
export const convertDateTimeZone = (
  sourceDateTime: Scalars["DateTime"]["input"],
  sourceTimeZone: string,
  targetTimeZone: string,
  targetFormatString?: string,
): Scalars["DateTime"]["output"] => {
  const dateObject = parseISO(sourceDateTime, {
    in: tz(sourceTimeZone),
  });
  const scalarDateTime = format(
    dateObject,
    targetFormatString ?? DATETIME_FORMAT_STRING,
    { in: tz(targetTimeZone) },
  );
  return scalarDateTime;
};

// Convert a DateTime scalar to a Date by stripping off the time
export const convertDateTimeToDate = (
  d: Scalars["DateTime"]["input"],
): Scalars["Date"]["output"] => {
  return d.substring(0, DATE_FORMAT_STRING.length);
};

/**
 * Parse an API scalar DateTime as UTC to a native Date object
 *
 * Adds a timezone offset if we think it does not exist
 * to support parsing the date into users local timezone properly
 */
export const parseDateTimeUtc = (d: Scalars["DateTime"]["input"]): Date => {
  let dateWithTimezone: string = d;
  // 1970-01-01 00:00:00 = 19 chars
  // 1970-01-01 = 10 chars
  if (d.length <= 19 && d.length > 10 && !dateWithTimezone.includes("+")) {
    dateWithTimezone = `${d}+00:00`;
  }
  return parseISO(dateWithTimezone);
};

/**
 * Take the current time, convert it to UTC, and then return that time in DATETIME_FORMAT_STRING
 * @returns string of formatted date
 */
export const nowUTCDateTime = (): string => {
  // get UTC time, in the appropriate format, from client
  // https://stackoverflow.com/a/11964609
  const now = new Date();
  const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const formattedNowUTC = format(nowUTC, DATETIME_FORMAT_STRING);
  return formattedNowUTC;
};
