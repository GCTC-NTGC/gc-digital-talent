import type { IntlShape } from "react-intl";

import {
  DATE_FORMAT_STRING,
  formatDate,
  formDateStringToDate,
} from "@gc-digital-talent/date-helpers";
import { Maybe, Scalars } from "~/api/generated";

export function formattedDate(date: Scalars["Date"], intl: IntlShape) {
  let dateString = date;

  // fix what comes out of the snapshots
  if (dateString.length === "yyyy-MM-ddT00:00:00.000000Z".length)
    dateString = date.substring(0, DATE_FORMAT_STRING.length);

  const parsedDate = formDateStringToDate(dateString);

  return formatDate({
    date: parsedDate,
    formatString: "MMMM yyyy",
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
