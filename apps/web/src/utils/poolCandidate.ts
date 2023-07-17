import isPast from "date-fns/isPast";
import { IntlShape } from "react-intl";

import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import { Maybe, PoolCandidateStatus, PublishingGroup } from "~/api/generated";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import {
  EXPIRED_STATUSES,
  PLACED_STATUSES,
  QUALIFIED_STATUSES,
} from "~/constants/poolCandidate";

import { isOngoingPublishingGroup } from "./poolUtils";

export const isQualifiedStatus = (
  status: Maybe<PoolCandidateStatus>,
): boolean => (status ? QUALIFIED_STATUSES.includes(status) : false);

export const isExpiredStatus = (
  status: Maybe<PoolCandidateStatus>,
  expirationDate?: Maybe<string>,
): boolean => {
  if (status) {
    return EXPIRED_STATUSES.includes(status);
  }

  if (expirationDate) {
    return isPast(parseDateTimeUtc(expirationDate));
  }

  return false;
};

export const isPlacedStatus = (status: Maybe<PoolCandidateStatus>): boolean =>
  status ? PLACED_STATUSES.includes(status) : false;

export const getRecruitmentType = (
  publishingGroup: Maybe<PublishingGroup>,
  intl: IntlShape,
) =>
  isOngoingPublishingGroup(publishingGroup)
    ? intl.formatMessage(poolCandidateMessages.ongoingRecruitment)
    : intl.formatMessage(poolCandidateMessages.targetedRecruitment);

export const isScreenedOutStatus = (
  status: Maybe<PoolCandidateStatus>,
): boolean => {
  return (
    status === PoolCandidateStatus.ScreenedOutApplication ||
    status === PoolCandidateStatus.ScreenedOutAssessment
  );
};
