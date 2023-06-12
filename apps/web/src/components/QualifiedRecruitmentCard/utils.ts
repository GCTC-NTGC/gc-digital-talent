import React from "react";
import { IntlShape } from "react-intl";

import { Color } from "@gc-digital-talent/ui";
import { getPoolCandidateStatus } from "@gc-digital-talent/i18n";

import { Maybe, PoolCandidateStatus, PublishingGroup } from "~/api/generated";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import {
  QUALIFIED_STATUSES,
  EXPIRED_STATUSES,
  ONGOING_PUBLISHING_GROUPS,
} from "~/constants/poolCandidate";

type StatusPillInfo = {
  color: Color;
  text: React.ReactNode;
};

export const isQualifiedStatus = (
  status: Maybe<PoolCandidateStatus>,
): boolean => (status ? QUALIFIED_STATUSES.includes(status) : false);

export const isExpiredStatus = (status: Maybe<PoolCandidateStatus>): boolean =>
  status ? EXPIRED_STATUSES.includes(status) : false;

export const isOngoingPublishingGroup = (
  publishingGroup: Maybe<PublishingGroup>,
): boolean =>
  publishingGroup ? ONGOING_PUBLISHING_GROUPS.includes(publishingGroup) : false;

export const getStatusPillInfo = (
  status: Maybe<PoolCandidateStatus>,
  intl: IntlShape,
): StatusPillInfo => {
  if (isQualifiedStatus(status)) {
    return {
      color: "success",
      text: intl.formatMessage(poolCandidateMessages.qualified),
    };
  }
  if (isExpiredStatus(status)) {
    return {
      color: "error",
      text: intl.formatMessage(poolCandidateMessages.expired),
    };
  }

  return {
    color: "primary",
    text: intl.formatMessage(getPoolCandidateStatus(status ?? "")),
  };
};
