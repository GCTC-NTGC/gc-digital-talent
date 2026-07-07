import { tv } from "tailwind-variants";
import PaperAirplaneIcon from "@heroicons/react/16/solid/PaperAirplaneIcon";
import ArchiveBoxIcon from "@heroicons/react/16/solid/ArchiveBoxIcon";
import CheckIcon from "@heroicons/react/16/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/16/solid/XMarkIcon";

import type { IconType } from "@gc-digital-talent/ui";
import {
  TalentRequestTrackedUserStatus,
  type LocalizedTalentRequestTrackedUserStatus,
} from "@gc-digital-talent/graphql";

export const statusIcons: Record<TalentRequestTrackedUserStatus, IconType> = {
  [TalentRequestTrackedUserStatus.Referred]: PaperAirplaneIcon,
  [TalentRequestTrackedUserStatus.NotReferred]: ArchiveBoxIcon,
  [TalentRequestTrackedUserStatus.Selected]: CheckIcon,
  [TalentRequestTrackedUserStatus.NotSelected]: XMarkIcon,
};

const statusIconStyle = tv({
  base: "size-4 shrink-0",
  variants: {
    status: {
      [TalentRequestTrackedUserStatus.Referred]:
        "text-primary-600 dark:text-primary-200",
      [TalentRequestTrackedUserStatus.NotReferred]:
        "text-gray-500 dark:text-gray-300",
      [TalentRequestTrackedUserStatus.Selected]:
        "text-success-600 dark:text-success-200",
      [TalentRequestTrackedUserStatus.NotSelected]:
        "text-error-600 dark:text-error-200",
    },
  },
});

interface StatusIconInfo {
  Icon?: IconType;
  className: string;
  label: string;
}

export const getStatusIcon = (
  status?: LocalizedTalentRequestTrackedUserStatus | null,
): StatusIconInfo | null => {
  if (!status?.value || !status.label.localized) return null;

  const statusValue = status?.value;
  const Icon = statusValue ? statusIcons[statusValue] : undefined;

  return {
    Icon,
    className: statusIconStyle({ status: statusValue }),
    label: status.label.localized,
  };
};
