/* eslint-disable import/no-duplicates */
// known issue with date-fns and eslint https://github.com/date-fns/date-fns/issues/1756#issuecomment-624803874
import type { IntlShape } from "react-intl";
import add from "date-fns/add";
import format from "date-fns/format";
import parse from "date-fns/parse";
import parseISO from "date-fns/parseISO";
import fr from "date-fns/locale/fr";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import toDate from "date-fns-tz/toDate";

import { Scalars } from "@gc-digital-talent/graphql";
import { getLocale } from "@gc-digital-talent/i18n";

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

export const formDateStringToDate = (value: string, fallback?: Date) => {
  return parse(value, DATE_FORMAT_STRING, fallback || new Date());
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
