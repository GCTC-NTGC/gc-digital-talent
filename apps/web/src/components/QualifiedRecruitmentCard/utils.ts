import React from "react";
import { IntlShape } from "react-intl";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import NoSymbolIcon from "@heroicons/react/20/solid/NoSymbolIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import StarIcon from "@heroicons/react/20/solid/StarIcon";

import { Color, IconType } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Department, Maybe, PoolCandidateStatus } from "~/api/generated";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import { fullPoolTitle, isOngoingPublishingGroup } from "~/utils/poolUtils";
import {
  isPlacedStatus,
  isQualifiedStatus,
  isExpiredStatus as isExpiredPoolCandidateStatus,
} from "~/utils/poolCandidate";
import { Application } from "~/utils/applicationUtils";
import {
  deriveStatusLabelKey as derivePoolCandidateStatusLabelKey,
  getStatusLabel as getPoolCandidateStatusLabel,
  isHiredStatus,
  isReadyToHireStatus,
  isExpiredStatus,
  isInactiveStatus,
  isErrorStatus,
} from "~/utils/poolCandidateMessages";
import { PoolCandidate } from "@gc-digital-talent/graphql";
import ShieldCheckIcon from "@heroicons/react/20/solid/ShieldCheckIcon";

export const joinDepartments = (
  departments: Maybe<Maybe<Department>[]>,
  intl: IntlShape,
) => {
  return (
    departments
      ?.map((department) => getLocalizedName(department?.name, intl))
      ?.join(", ") ?? ""
  );
};

type StatusPillInfo = {
  color: Color;
  text: React.ReactNode;
  icon?: IconType;
};

export const getStatusPillInfo = (
  status: Maybe<PoolCandidateStatus>,
  suspendedAt: PoolCandidate["suspendedAt"],
  intl: IntlShape,
): StatusPillInfo => {
  const labelKey = derivePoolCandidateStatusLabelKey(status, suspendedAt);
  const label = labelKey ? getPoolCandidateStatusLabel(labelKey) : null;

  if (isReadyToHireStatus(labelKey)) {
    return {
      color: "success",
      text: label ? intl.formatMessage(label) : "",
      icon: ShieldCheckIcon,
    };
  }
  if (isHiredStatus(labelKey)) {
    return {
      color: "secondary",
      text: label ? intl.formatMessage(label) : "",
    };
  }
  if (isExpiredStatus(labelKey)) {
    return {
      color: "black",
      text: label ? intl.formatMessage(label) : "",
    };
  }
  if (isInactiveStatus(labelKey)) {
    return {
      color: "warning",
      text: label ? intl.formatMessage(label) : "",
    };
  }
  if (isErrorStatus(labelKey)) {
    return {
      color: "error",
      text: label ? intl.formatMessage(label) : "",
    };
  }

  return {
    color: "primary",
    text: label ? intl.formatMessage(label) : "",
  };
};
type AvailabilityInfo = {
  icon: IconType;
  color: Record<string, string>;
  text: React.ReactNode;
  showDialog: boolean;
};

const getAvailabilityInfo = (
  { status, suspendedAt }: Application,
  intl: IntlShape,
): AvailabilityInfo => {
  if (isExpiredPoolCandidateStatus(status)) {
    return {
      icon: LockClosedIcon,
      color: {
        "data-h2-color": "base(gray.darker)",
      },
      text: intl.formatMessage(poolCandidateMessages.expiredAvailability),
      showDialog: false,
    };
  }

  if (isPlacedStatus(status)) {
    return {
      icon: StarIcon,
      color: {
        "data-h2-color": "base(quaternary.dark)",
      },
      text: intl.formatMessage(poolCandidateMessages.placedAvailability),
      showDialog: false,
    };
  }

  return suspendedAt
    ? {
        icon: NoSymbolIcon,
        color: {
          "data-h2-color": "base(error)",
        },
        text: intl.formatMessage(poolCandidateMessages.suspendedAvailability),
        showDialog: true,
      }
    : {
        icon: CheckCircleIcon,
        color: {
          "data-h2-color": "base(success)",
        },
        text: intl.formatMessage(poolCandidateMessages.openAvailability),
        showDialog: true,
      };
};

type QualifiedRecruitmentInfo = {
  statusPill: StatusPillInfo;
  availability: AvailabilityInfo;
  isQualified: boolean;
  isOngoing: boolean;
  title: {
    html: React.ReactNode;
    label: string;
  };
};

export const getQualifiedRecruitmentInfo = (
  candidate: Application,
  intl: IntlShape,
): QualifiedRecruitmentInfo => {
  return {
    statusPill: getStatusPillInfo(
      candidate.status,
      candidate.suspendedAt,
      intl,
    ),
    availability: getAvailabilityInfo(candidate, intl),
    isQualified: isQualifiedStatus(candidate.status),
    isOngoing: isOngoingPublishingGroup(candidate.pool.publishingGroup),
    title: fullPoolTitle(intl, candidate.pool),
  };
};
