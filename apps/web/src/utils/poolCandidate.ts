import { IntlShape } from "react-intl";
import isPast from "date-fns/isPast";

import {
  formatDate,
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";

import { Maybe, PoolCandidateStatus, PublishingGroup } from "~/api/generated";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import QUALIFIED_STATUSES from "~/constants/poolCandidate";

import { isOngoingPublishingGroup } from "./poolUtils";

export const isQualifiedStatus = (
  status: Maybe<PoolCandidateStatus> | undefined,
): boolean => (status ? QUALIFIED_STATUSES.includes(status) : false);

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
