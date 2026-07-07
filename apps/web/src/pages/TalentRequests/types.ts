import type ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";

import type {
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserNotSelectedReason,
} from "@gc-digital-talent/graphql";

export interface RouteParams extends Record<string, string> {
  talentRequestId: string;
}

export type StatusReasonType = "notReferred" | "notSelected";

export interface StatusDialogConfig {
  status: string;
  icon: typeof ArrowRightCircleIcon;
  disable: boolean;
  onConfirm?: () => Promise<void>;
  reasonType?: StatusReasonType;
  onUpdate?: (
    reason:
      | TalentRequestTrackedUserNotReferredReason
      | TalentRequestTrackedUserNotSelectedReason,
  ) => Promise<void>;
}
