import { IntlShape } from "react-intl";

import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { PoolCandidate } from "@gc-digital-talent/graphql";

import {
  formatClosingDate,
  formatSubmittedAt,
  isDraft,
} from "~/utils/poolCandidate";

type Application = Omit<PoolCandidate, "user">;

const differenceInDays = (date1: Date, date2: Date): number => {
  // Calculate the time difference in milliseconds
  const timeDiff = date2.getTime() - date1.getTime();

  // Convert milliseconds to days
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
};

const isClosingSoon = (date: Date): boolean => {
  const daysDiff = differenceInDays(new Date(), date);

  return daysDiff <= 3;
};

type ApplicationDateInfo = {
  message: string;
  color: string;
  date: string;
};

// Note: File will grow
// eslint-disable-next-line import/prefer-default-export
export const getApplicationDateInfo = (
  application: Application,
  intl: IntlShape,
): ApplicationDateInfo => {
  const ApplyBy = intl.formatMessage({
    defaultMessage: "Apply by",
    id: "a+j1+H",
    description: "Label for showing the closing date of a job posting.",
  });
  const AppliedOn = intl.formatMessage({
    defaultMessage: "Applied on",
    id: "BdsZwe",
    description: "Label for showing the submitted date of an application.",
  });
  const message = isDraft(application.status) ? ApplyBy : AppliedOn;
  const closingDate = application.pool.closingDate
    ? parseDateTimeUtc(application.pool.closingDate)
    : "";
  const color =
    closingDate && isClosingSoon(closingDate) && isDraft(application.status)
      ? "base(error)"
      : "base(black.light)";

  const date = isDraft(application.status)
    ? formatClosingDate(application.pool.closingDate, intl) || ""
    : formatSubmittedAt(application.submittedAt, intl);
  return { message, color, date };
};
