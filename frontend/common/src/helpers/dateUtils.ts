import type { IntlShape } from "react-intl";
import { format, formatDistance, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";
import { Maybe, Scalars } from "../api/generated";
import { getLocale, Locales } from "./localize";

// https://date-fns.org/docs/format
// Date scalar formatting string
export const DATE_FORMAT_STRING = "yyyy-MM-dd";
// DateTime scalar formatting string
export const DATETIME_FORMAT_STRING = "yyyy-MM-dd HH:mm:ss";
export const LONG_DAY_FORMAT_STRING = "EEEE, d MMMM yyyy";

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

const DAY_IN_SECONDS = 86400;

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

/**
 *
 * @param date The date you would like to format
 * @param intl react-intl object
 * @returns Boolean if in past otherwise, string of formatted date
 */
export const relativeExpiryDate = (
  date: Date,
  intl: IntlShape,
): string | boolean => {
  const strLocale = getLocale(intl);
  const locale = strLocale === "fr" ? fr : undefined;
  const now = new Date();
  const diff = date.getTime() / 1000 - now.getTime() / 1000;
  const roundedDiff = Math.round(diff);
  const time = format(date, `ppp`, {
    locale,
  });
  const day = format(date, `EEEE, d MMMM yyyy`, {
    locale,
  });
  const days = formatDistance(date, now, {
    locale,
    addSuffix: false,
  });

  if (roundedDiff < 0) {
    return intl.formatMessage({
      defaultMessage: "The deadline for submission has passed.",
      id: "PzyMeM",
      description: "Message displayed when a date has expired.",
    });
  }

  if (roundedDiff < DAY_IN_SECONDS) {
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

  if (roundedDiff < DAY_IN_SECONDS * 2) {
    return intl.formatMessage(
      {
        defaultMessage: "Closes tomorrow at {time}",
        id: "GqmxO8",
        description: "Text displayed when relative date is tomorrow.",
      },
      { time },
    );
  }

  return `${day} (${days})`;
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
  const nativeDate = zonedTimeToUtc(sourceDateTime, sourceTimeZone);
  const scalarDateTime = formatInTimeZone(
    nativeDate,
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
  zonedTimeToUtc(d, "UTC");
