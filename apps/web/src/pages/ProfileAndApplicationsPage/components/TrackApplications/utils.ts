import { IntlShape } from "react-intl";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  formatClosingDate,
  formatSubmittedAt,
  isDraft,
} from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/utils";
import { PoolCandidate } from "~/api/generated";

export type Application = Omit<PoolCandidate, "user">;

export const differenceInDays = (date1: Date, date2: Date): number => {
  // Calculate the time difference in milliseconds
  const timeDiff = date2.getTime() - date1.getTime();

  // Convert milliseconds to days
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
};

export const isClosingSoon = (date: Date): boolean => {
  const daysDiff = differenceInDays(new Date(), date);

  return daysDiff <= 3;
};
export type ApplicationDateInfo = {
  message: string;
  color: string;
  date: string;
};

export const getApplicationDateInfo = (
  application: Application,
  intl: IntlShape,
): ApplicationDateInfo => {
  const message = isDraft(application.status) ? "Apply By: " : "Applied On: ";
  const closingDate = application.pool.closingDate
    ? parseDateTimeUtc(application.pool.closingDate)
    : "";
  const color =
    closingDate && isClosingSoon(closingDate)
      ? "base(error)"
      : "base(black.light)";

  const date = isDraft(application.status)
    ? formatClosingDate(application.pool.closingDate, intl)
    : formatSubmittedAt(application.submittedAt, intl);
  return { message, color, date };
};
