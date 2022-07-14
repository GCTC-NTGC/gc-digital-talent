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

const DAY_IN_SECONDS = 86400;

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
  const time = format(date, `h:mm aaaa xxxxx`, {
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
      description: "Message displayed when a date has expired.",
    });
  }

  if (roundedDiff < DAY_IN_SECONDS) {
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

  if (roundedDiff < DAY_IN_SECONDS * 2) {
    return intl.formatMessage(
      {
        defaultMessage: "Closes tomorrow at {time}",
        description: "Text displayed when relative date is tomorrow.",
      },
      { time },
    );
  }

  return `${day} (${days})`;
};
