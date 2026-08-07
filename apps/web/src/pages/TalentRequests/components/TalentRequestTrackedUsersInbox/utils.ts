import { tv } from "tailwind-variants";
import BookmarkSquareIconSolid from "@heroicons/react/16/solid/BookmarkSquareIcon";
import ArchiveBoxIconSolid from "@heroicons/react/16/solid/ArchiveBoxIcon";
import CheckIconSolid from "@heroicons/react/16/solid/CheckIcon";
import NoSymbolIconSolid from "@heroicons/react/16/solid/NoSymbolIcon";
import BookmarkSquareIconOutline from "@heroicons/react/24/outline/BookmarkSquareIcon";
import ArchiveBoxIconOutline from "@heroicons/react/24/outline/ArchiveBoxIcon";
import CheckIconOutline from "@heroicons/react/24/outline/CheckIcon";
import NoSymbolIconOutline from "@heroicons/react/24/outline/NoSymbolIcon";

import type { IconType } from "@gc-digital-talent/ui";
import {
  TalentRequestTrackedUserStatus,
  type LocalizedTalentRequestTrackedUserStatus,
} from "@gc-digital-talent/graphql";

export const statusIcons: Record<
  "solid" | "outline",
  Record<TalentRequestTrackedUserStatus, IconType>
> = {
  solid: {
    [TalentRequestTrackedUserStatus.Referred]: BookmarkSquareIconSolid,
    [TalentRequestTrackedUserStatus.NotReferred]: ArchiveBoxIconSolid,
    [TalentRequestTrackedUserStatus.Selected]: CheckIconSolid,
    [TalentRequestTrackedUserStatus.NotSelected]: NoSymbolIconSolid,
  },
  outline: {
    [TalentRequestTrackedUserStatus.Referred]: BookmarkSquareIconOutline,
    [TalentRequestTrackedUserStatus.NotReferred]: ArchiveBoxIconOutline,
    [TalentRequestTrackedUserStatus.Selected]: CheckIconOutline,
    [TalentRequestTrackedUserStatus.NotSelected]: NoSymbolIconOutline,
  },
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
  const Icon = statusValue ? statusIcons.solid[statusValue] : undefined;

  return {
    Icon,
    className: statusIconStyle({ status: statusValue }),
    label: status.label.localized,
  };
};
