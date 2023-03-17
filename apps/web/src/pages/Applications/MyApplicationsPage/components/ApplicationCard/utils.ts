import { isPast } from "date-fns";
import { IntlShape } from "react-intl";

import {
  formatDate,
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";

import { Maybe, PoolCandidateStatus } from "~/api/generated";

export const isDraft = (status: Maybe<PoolCandidateStatus>): boolean => {
  return status === PoolCandidateStatus.Draft;
};

export const isPlaced = (status: Maybe<PoolCandidateStatus>): boolean => {
  return status
    ? [
        PoolCandidateStatus.PlacedCasual,
        PoolCandidateStatus.PlacedIndeterminate,
        PoolCandidateStatus.PlacedTerm,
      ].includes(status)
    : false;
};

export const isExpired = (
  status: Maybe<PoolCandidateStatus>,
  expirationDate: Maybe<string>,
): boolean => {
  if (status === PoolCandidateStatus.Expired) {
    return true;
  }
  return expirationDate ? isPast(parseDateTimeUtc(expirationDate)) : false;
};

export const canBeArchived = (
  status: Maybe<PoolCandidateStatus>,
  archivedAt: Maybe<string>,
): boolean => {
  return status
    ? [
        PoolCandidateStatus.Removed,
        PoolCandidateStatus.Expired,
        PoolCandidateStatus.ScreenedOutApplication,
        PoolCandidateStatus.ScreenedOutAssessment,
      ].includes(status) && !archivedAt
    : false;
};

export const canBeDeleted = (status: Maybe<PoolCandidateStatus>): boolean => {
  return status
    ? [PoolCandidateStatus.Draft, PoolCandidateStatus.DraftExpired].includes(
        status,
      )
    : false;
};

export const formatClosingDate = (
  closingDate: Maybe<string>,
  intl: IntlShape,
): string => {
  return closingDate
    ? relativeClosingDate({
        closingDate: parseDateTimeUtc(closingDate),
        intl,
      })
    : "";
};

export const formatSubmittedAt = (
  submittedAt: Maybe<string>,
  intl: IntlShape,
): string => {
  return submittedAt
    ? formatDate({
        date: parseDateTimeUtc(submittedAt),
        formatString: "MMMM do, yyyy",
        intl,
      })
    : "";
};
