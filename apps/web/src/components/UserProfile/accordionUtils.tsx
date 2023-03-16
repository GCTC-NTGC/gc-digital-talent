import type { IntlShape } from "react-intl";

import { formatDate } from "@gc-digital-talent/date-helpers";
import { Maybe, Scalars } from "~/api/generated";

export function formattedDate(date: Scalars["Date"], intl: IntlShape) {
  return formatDate({
    date: new Date(date),
    formatString: "MMMM RRRR",
    intl,
  });
}

export function getDateRange({
  endDate,
  startDate,
  intl,
}: {
  endDate: Maybe<Scalars["Date"]>;
  startDate: Maybe<Scalars["Date"]>;
  intl: IntlShape;
}): string {
  if (!startDate) return "";
  const d1 = formattedDate(startDate, intl);
  if (!endDate)
    return intl.formatMessage(
      {
        defaultMessage: "Since: {d1}",
        id: "Zm9Hnf",
        description: "Since",
      },
      { d1 },
    );
  const d2 = formattedDate(endDate, intl);
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
