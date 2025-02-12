import { IntlShape } from "react-intl";
import NoSymbolIcon from "@heroicons/react/20/solid/NoSymbolIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import { ReactNode } from "react";

import { IconType } from "@gc-digital-talent/ui";
import { PoolCandidateStatus } from "@gc-digital-talent/graphql";

import poolCandidateMessages from "~/messages/poolCandidateMessages";
import { poolTitle } from "~/utils/poolUtils";
import { Application } from "~/utils/applicationUtils";
import {
  getQualifiedRecruitmentStatusChip,
  isInactiveStatus,
  isPlacedStatus,
  isSuspendedStatus,
  StatusChipWithDescription,
} from "~/utils/poolCandidate";

interface AvailabilityInfo {
  icon: IconType | null;
  color: Record<string, string>;
  text: ReactNode;
  showDialog: boolean;
}

const getAvailabilityInfo = (
  { status, suspendedAt }: Application,
  intl: IntlShape,
): AvailabilityInfo => {
  if (status?.value === PoolCandidateStatus.Expired) {
    return {
      icon: null,
      color: {},
      text: null,
      showDialog: false,
    };
  }

  // placed casual is an exception, it can be suspended
  if (
    isPlacedStatus(status?.value) &&
    status?.value !== PoolCandidateStatus.PlacedCasual
  ) {
    return {
      icon: null,
      color: {},
      text: null,
      showDialog: false,
    };
  }

  if (isSuspendedStatus(status?.value, suspendedAt)) {
    return {
      icon: NoSymbolIcon,
      color: {
        "data-h2-color": "base(error)",
      },
      text: intl.formatMessage(poolCandidateMessages.suspendedAvailability),
      showDialog: true,
    };
  }

  if (isInactiveStatus(status?.value)) {
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

interface QualifiedRecruitmentInfo {
  statusChip: StatusChipWithDescription;
  availability: AvailabilityInfo;
  title: {
    html: ReactNode;
    label: string;
  };
}

export const getQualifiedRecruitmentInfo = (
  candidate: Application,
  intl: IntlShape,
): QualifiedRecruitmentInfo => {
  return {
    statusChip: getQualifiedRecruitmentStatusChip(
      candidate.suspendedAt,
      candidate.placedAt,
      candidate.status?.value ?? null,
      intl,
    ),
    availability: getAvailabilityInfo(candidate, intl),
    title: poolTitle(intl, candidate.pool),
  };
};
