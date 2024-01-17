import { IntlShape } from "react-intl";
import isPast from "date-fns/isPast";

import {
  formatDate,
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";
import {
  commonMessages,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";

import { Maybe, PoolCandidateStatus, PublishingGroup } from "~/api/generated";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import {
  QUALIFIED_STATUSES,
  DISQUALIFIED_STATUSES,
  REMOVED_STATUSES,
  TO_ASSESS_STATUSES,
  PLACED_STATUSES,
  NOT_PLACED_STATUSES,
} from "~/constants/poolCandidate";

import { isOngoingPublishingGroup } from "./poolUtils";

export const isDisqualifiedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? DISQUALIFIED_STATUSES.includes(status) : false);

export const isRemovedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? REMOVED_STATUSES.includes(status) : false);

export const isQualifiedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? QUALIFIED_STATUSES.includes(status) : false);

export const isToAssessStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? TO_ASSESS_STATUSES.includes(status) : false);

export const isPlacedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? PLACED_STATUSES.includes(status) : false);

export const isNotPlacedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? NOT_PLACED_STATUSES.includes(status) : false);

export const getRecruitmentType = (
  publishingGroup: Maybe<PublishingGroup> | undefined,
  intl: IntlShape,
) =>
  isOngoingPublishingGroup(publishingGroup)
    ? intl.formatMessage(poolCandidateMessages.ongoingRecruitment)
    : intl.formatMessage(poolCandidateMessages.targetedRecruitment);

export const isDraft = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => {
  return status === PoolCandidateStatus.Draft;
};

export const isExpired = (
  status: Maybe<PoolCandidateStatus> | undefined,
  expirationDate: Maybe<string> | undefined,
): boolean => {
  if (status === PoolCandidateStatus.Expired) {
    return true;
  }
  return expirationDate ? isPast(parseDateTimeUtc(expirationDate)) : false;
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
        formatString: "PPP p",
        intl,
      })
    : "";
};

export const statusToFinalDecision = (status?: Maybe<PoolCandidateStatus>) => {
  if (isToAssessStatus(status)) {
    return poolCandidateMessages.toAssess;
  }

  if (isDisqualifiedStatus(status)) {
    return poolCandidateMessages.disqualified;
  }

  if (isRemovedStatus(status)) {
    return poolCandidateMessages.removed;
  }

  if (isQualifiedStatus(status)) {
    return poolCandidateMessages.qualified;
  }

  return commonMessages.notAvailable;
};

export const statusToJobPlacement = (status?: Maybe<PoolCandidateStatus>) => {
  if (status) {
    if (isNotPlacedStatus(status)) {
      return poolCandidateMessages.notPlaced;
    }

    if (isPlacedStatus(status)) {
      return getPoolCandidateStatus(status);
    }
  }

  return commonMessages.notAvailable;
};
