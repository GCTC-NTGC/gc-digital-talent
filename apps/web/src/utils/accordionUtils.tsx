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

  const formattedStartDate = formattedDate(startDate, intl);
  if (!endDate)
    return intl.formatMessage(
      {
        defaultMessage: "{date} - Present",
        id: "9OBHdP",
        description: "A date range that goes to the present day",
      },
      { date: formattedStartDate },
    );
  const formattedEndDate = formattedDate(endDate, intl);
  return `${formattedStartDate} - ${formattedEndDate}`;
}
