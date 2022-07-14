import type { IntlShape } from "react-intl";
import { format, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { Maybe, Scalars } from "../api/generated";
import { getLocale, Locales } from "./localize";

export function formattedDate(date: Scalars["Date"], locale: Locales) {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
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
          description: "Since",
        },
        { d1 },
      );
}

const DAY_IN_MILLISECONDS = 86400000;

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
  const diff = date.getTime() - now.getTime();
  const time = format(date, `h:mm aaaa xxxxx`);
  const days = formatDistance(date, now, {
    locale,
    addSuffix: true,
  });

  if (diff < 0) {
    return intl.formatMessage({
      defaultMessage: "The deadline for submission has passed.",
      description: "Message displayed when a date has expired.",
    });
  }

  if (diff < DAY_IN_MILLISECONDS) {
    return intl.formatMessage(
      {
        defaultMessage: "Closes today at {time}",
        description: "Text displayed when relative date is today.",
      },
      {
        time,
      },
    );
  }

  if (diff < DAY_IN_MILLISECONDS * 2 && diff > 0) {
    return intl.formatMessage(
      {
        defaultMessage: "Closes tomorrow at {time}",
        description: "Text displayed when relative date is tomorrow.",
      },
      { time },
    );
  }

  return intl.formatMessage(
    {
      defaultMessage: "Closes {days}",
      description: "Text displayed when expiry date is in X amount of days",
    },
    {
      days,
    },
  );
};
export const FAR_FUTURE_DATE = new Date(2999, 12, 31);
export const FAR_PAST_DATE = new Date(1970, 1, 1);
