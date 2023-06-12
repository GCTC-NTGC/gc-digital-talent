import React from "react";
import { IntlShape } from "react-intl";

import { Color, IconType } from "@gc-digital-talent/ui";
import { getPoolCandidateStatus } from "@gc-digital-talent/i18n";

import { Maybe, PoolCandidateStatus, PublishingGroup } from "~/api/generated";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import {
  QUALIFIED_STATUSES,
  EXPIRED_STATUSES,
  ONGOING_PUBLISHING_GROUPS,
  PLACED_STATUSES,
} from "~/constants/poolCandidate";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import isPast from "date-fns/isPast";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import NoSymbolIcon from "@heroicons/react/20/solid/NoSymbolIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import StarIcon from "@heroicons/react/20/solid/StarIcon";

type StatusPillInfo = {
  color: Color;
  text: React.ReactNode;
};

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

type AvailabilityInfo = {
  icon: IconType;
  color: Record<string, string>;
  text: React.ReactNode;
};

export const getAvailabilityInfo = (
  status: Maybe<PoolCandidateStatus>,
  isSuspended: boolean,
  intl: IntlShape,
): AvailabilityInfo => {
  if (isExpiredStatus(status)) {
    return {
      icon: LockClosedIcon,
      color: {
        "data-h2-color": "base(gray.darker)",
      },
      text: intl.formatMessage(poolCandidateMessages.expiredAvailability),
    };
  }

  if (isPlacedStatus(status)) {
    return {
      icon: StarIcon,
      color: {
        "data-h2-color": "base(quaternary.dark)",
      },
      text: intl.formatMessage(poolCandidateMessages.placedAvailability),
    };
  }

  return isSuspended
    ? {
        icon: NoSymbolIcon,
        color: {
          "data-h2-color": "base(error)",
        },
        text: intl.formatMessage(poolCandidateMessages.suspendedAvailability),
      }
    : {
        icon: CheckCircleIcon,
        color: {
          "data-h2-color": "base(success)",
        },
        text: intl.formatMessage(poolCandidateMessages.openAvailability),
      };
};
