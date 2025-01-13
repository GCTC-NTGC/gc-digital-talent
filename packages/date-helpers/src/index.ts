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
 * Attempts to get the users local timezone
 */
export const getLocalTimezone = (): string | undefined => {
  let localTz;
  if (window.Intl && typeof window.Intl === "object") {
    localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  return localTz;
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
  const locale: Locale = strLocale === "fr" ? fr : en;
  const localTz = getLocalTimezone();
  const formatTz = timeZone ?? localTz;

  // A date formatting function that can use time zones optionally
  const result = format(date, formatString, {
    locale,
    in: formatTz ? tz(formatTz) : undefined,
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

// Parse an API scalar DateTime as UTC to a native Date object
export const parseDateTimeUtc = (d: Scalars["DateTime"]["input"]): Date =>
  parseISO(d, { in: tz("UTC") });

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
