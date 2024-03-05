import React from "react";
import { IntlShape } from "react-intl";
import NoSymbolIcon from "@heroicons/react/20/solid/NoSymbolIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ShieldCheckIcon from "@heroicons/react/20/solid/ShieldCheckIcon";

import { Color, IconType } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import {
  PoolCandidate,
  Department,
  Maybe,
  PoolCandidateStatus,
} from "@gc-digital-talent/graphql";

import poolCandidateMessages from "~/messages/poolCandidateMessages";
import { poolTitle } from "~/utils/poolUtils";
import { Application } from "~/utils/applicationUtils";
import {
  deriveCombinedStatus,
  getCombinedStatusLabel,
  isHiredCombinedStatus,
  isReadyToHireCombinedStatus,
  isExpiredCombinedStatus,
  isInactiveCombinedStatus,
  isErrorCombinedStatus,
  isSuspendedCombinedStatus,
} from "~/utils/poolCandidateCombinedStatus";

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
  status: Maybe<PoolCandidateStatus> | undefined,
  suspendedAt: PoolCandidate["suspendedAt"],
  intl: IntlShape,
): StatusPillInfo => {
  const combinedStatus = deriveCombinedStatus(status, suspendedAt);
  const combinedStatusLabel = combinedStatus
    ? getCombinedStatusLabel(combinedStatus)
    : null;
  const text = combinedStatusLabel
    ? intl.formatMessage(combinedStatusLabel)
    : "";

  if (isReadyToHireCombinedStatus(combinedStatus)) {
    return {
      color: "success",
      text,
      icon: ShieldCheckIcon,
    };
  }
  if (isHiredCombinedStatus(combinedStatus)) {
    return {
      color: "secondary",
      text,
    };
  }
  if (isExpiredCombinedStatus(combinedStatus)) {
    return {
      color: "black",
      text,
    };
  }
  if (isInactiveCombinedStatus(combinedStatus)) {
    return {
      color: "warning",
      text,
    };
  }
  if (isErrorCombinedStatus(combinedStatus)) {
    return {
      color: "error",
      text,
    };
  }

  return {
    color: "primary",
    text,
  };
};
type AvailabilityInfo = {
  icon: IconType | null;
  color: Record<string, string>;
  text: React.ReactNode;
  showDialog: boolean;
};

const getAvailabilityInfo = (
  { status, suspendedAt }: Application,
  intl: IntlShape,
): AvailabilityInfo => {
  const combinedStatus = deriveCombinedStatus(status, suspendedAt);

  if (isExpiredCombinedStatus(combinedStatus)) {
    return {
      icon: null,
      color: {},
      text: null,
      showDialog: false,
    };
  }

  if (isHiredCombinedStatus(combinedStatus)) {
    return {
      icon: null,
      color: {},
      text: null,
      showDialog: false,
    };
  }

  if (isSuspendedCombinedStatus(combinedStatus)) {
    return {
      icon: NoSymbolIcon,
      color: {
        "data-h2-color": "base(error)",
      },
      text: intl.formatMessage(poolCandidateMessages.suspendedAvailability),
      showDialog: true,
    };
  }

  if (isInactiveCombinedStatus(combinedStatus)) {
    return {
      icon: null,
      color: {},
      text: null,
      showDialog: false,
    };
  }

  return {
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
    title: poolTitle(intl, candidate.pool),
  };
};
