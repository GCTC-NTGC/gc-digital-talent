import type { IntlShape } from "react-intl";
import { add, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { Maybe, Scalars } from "../api/generated";
import { getLocale, Locales } from "./localize";

// https://date-fns.org/docs/format
// Date scalar formatting string
export const DATE_FORMAT_STRING = "yyyy-MM-dd";
// DateTime scalar formatting string
export const DATETIME_FORMAT_STRING = "yyyy-MM-dd HH:mm:ss";

export function formattedDate(date: Scalars["Date"], locale: Locales) {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const formatDate = formatter.format(new Date(date));
  const formattedMonth = formatDate.substring(0, 4).toUpperCase();
  const formattedYear = formatDate.substring(4, 10);
  return `${formattedMonth}  ${formattedYear}`;
}

export function getDateRange({
  endDate,
  startDate,
  intl,
  locale,
}: {
  endDate: Maybe<Scalars["Date"]>;
  startDate: Maybe<Scalars["Date"]>;
  intl: IntlShape;
  locale: Locales;
}): React.ReactNode {
  if (!startDate) return null;
  const d1 = formattedDate(startDate, locale);
  if (!endDate)
    return intl.formatMessage(
      {
        defaultMessage: "Since: {d1}",
        id: "Zm9Hnf",
        description: "Since",
      },
      { d1 },
    );
  const d2 = formattedDate(endDate, locale);
  return endDate
    ? `${d1} - ${d2}`
    : intl.formatMessage(
        {
          defaultMessage: "Since: {d1}",
          id: "Zm9Hnf",
          description: "Since",
        },
        { d1 },
      );
}

/**
 * @param date
 * @param intl
 * @returns String in the format of MONTH DAY, YEAR localized
 */
export const formattedDateMonthDayYear = (
  date: Date,
  intl: IntlShape,
  timeZone?: string,
): string => {
  const strLocale = getLocale(intl);
  const locale = strLocale === "fr" ? fr : undefined;
  const formatString = `MMMM d, yyyy`;
  const day = timeZone
    ? formatInTimeZone(date, timeZone, formatString, {
        locale,
      })
    : format(date, formatString, {
        locale,
      });
  return `${day}`;
};

// parameters for the relativeExpiryDate function
export type relativeExpiryDateOptions = {
  expiryDate: Date;
  now?: Date;
  intl: IntlShape;
  timeZone?: string;
};

/**
 * Calculate a friendly date/time string, optionally in a different time zone
 * @returns string of formatted date
 */
export const relativeExpiryDate = ({
  expiryDate,
  now = new Date(),
  intl,
  timeZone,
}: relativeExpiryDateOptions): string => {
  // A date formatting function that can use time zones optionally
  const myFormatFunc = timeZone
    ? (date: Date, formatPattern: string, options?: { locale?: Locale }) =>
        formatInTimeZone(date, timeZone, formatPattern, options)
    : (date: Date, formatPattern: string, options?: { locale?: Locale }) =>
        format(date, formatPattern, options);

  const strLocale = getLocale(intl);
  const locale = strLocale === "fr" ? fr : undefined;
  const time = myFormatFunc(expiryDate, `pp`, {
    locale,
  });
  const dateTime = myFormatFunc(expiryDate, `PPP p`, {
    locale,
  });

  if (now > expiryDate) {
    return intl.formatMessage({
      defaultMessage: "The deadline for submission has passed.",
      id: "PzyMeM",
      description: "Message displayed when a date has expired.",
    });
  }

  if (
    myFormatFunc(now, DATE_FORMAT_STRING) ===
    myFormatFunc(expiryDate, DATE_FORMAT_STRING)
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
    myFormatFunc(expiryDate, DATE_FORMAT_STRING)
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
