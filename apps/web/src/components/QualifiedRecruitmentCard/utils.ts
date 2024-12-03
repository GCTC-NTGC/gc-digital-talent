import { IntlShape } from "react-intl";
import NoSymbolIcon from "@heroicons/react/20/solid/NoSymbolIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ShieldCheckIcon from "@heroicons/react/20/solid/ShieldCheckIcon";
import { ReactNode } from "react";

import { Color, IconType } from "@gc-digital-talent/ui";
import {
  PoolCandidate,
  Maybe,
  PoolCandidateStatus,
} from "@gc-digital-talent/graphql";

import poolCandidateMessages from "~/messages/poolCandidateMessages";
import { poolTitle } from "~/utils/poolUtils";
import { Application } from "~/utils/applicationUtils";
import {
  derivedStatusLabel,
  isInactiveStatus,
  isNotPlacedStatus,
  isPlacedStatus,
  isScreenedOutStatus,
  isSuspendedStatus,
} from "~/utils/poolCandidate";

interface StatusChipInfo {
  color: Color;
  text: ReactNode;
  icon?: IconType;
}

export const getStatusChipInfo = (
  status: Maybe<PoolCandidateStatus> | undefined,
  suspendedAt: PoolCandidate["suspendedAt"],
  intl: IntlShape,
): StatusChipInfo => {
  const statusLabelMessage = derivedStatusLabel(status, suspendedAt);
  const text = statusLabelMessage ? intl.formatMessage(statusLabelMessage) : "";

  if (isNotPlacedStatus(status)) {
    return {
      color: "success",
      text,
      icon: ShieldCheckIcon,
    };
  }
  if (isPlacedStatus(status)) {
    return {
      color: "secondary",
      text,
    };
  }
  if (status === PoolCandidateStatus.Expired || isScreenedOutStatus(status)) {
    return {
      color: "black",
      text,
    };
  }
  if (isInactiveStatus(status)) {
    return {
      color: "warning",
      text,
    };
  }
  return {
    color: "primary",
    text,
  };
};
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

  if (isPlacedStatus(status?.value)) {
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
  statusChip: StatusChipInfo;
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
    statusChip: getStatusChipInfo(
      candidate.status?.value,
      candidate.suspendedAt,
      intl,
    ),
    availability: getAvailabilityInfo(candidate, intl),
    title: poolTitle(intl, candidate.pool),
  };
};
