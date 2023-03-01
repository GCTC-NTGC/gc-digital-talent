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

export const isExpired = (expirationDate: Maybe<string>): boolean => {
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
