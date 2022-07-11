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

export const relativeDate = (date: Date, intl: IntlShape) => {
  const strLocale = getLocale(intl);
  const locale = strLocale === "fr" ? fr : undefined;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  let relative = formatDistance(date, now, {
    locale,
    addSuffix: true,
  });

  if (diff < DAY_IN_MILLISECONDS && diff > -(DAY_IN_MILLISECONDS - 1)) {
    relative = intl.formatMessage({
      defaultMessage: "Today",
      description: "Text displayed when relative date is today.",
    });
  }

  if (diff < DAY_IN_MILLISECONDS * 2 && diff > 0) {
    relative = intl.formatMessage({
      defaultMessage: "Tomorrow",
      description: "Text displayed when relative date is tomorrow.",
    });
  }

  if (diff > -(DAY_IN_MILLISECONDS * 2) && diff < 0) {
    relative = intl.formatMessage({
      defaultMessage: "Yesterday",
      description: "Text displayed when relative date is yesterday.",
    });
  }

  const formatted = format(date, "PP", { locale });

  return `${formatted} (${relative})`;
};
