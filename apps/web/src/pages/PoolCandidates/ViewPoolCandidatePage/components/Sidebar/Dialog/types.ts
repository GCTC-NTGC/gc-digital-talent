import type { MessageDescriptor } from "react-intl";
import type { OperationResult } from "urql";

import type {
  ApplicationStatus,
  CandidateRemovalReason,
  DisqualificationReason,
  PlacementType,
  PauseReferralsLength,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  status?: ApplicationStatus;
  expiryDate?: string;
  placementType?: PlacementType;
  department?: string;
  disqualificationReason?: DisqualificationReason;
  removalReason?: CandidateRemovalReason;
  removalReasonOther?: string;
  referralPauseStatus: boolean;
  pauseReferralsLength?: PauseReferralsLength;
  resumeReferralsAt?: string;
  pauseReferralsReason?: string;
  placedStartDate: string | null;
  placedEndDate: string | null;
}

export interface MutationMessages {
  success: MessageDescriptor;
  error: MessageDescriptor;
}

export type MutationHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: Promise<OperationResult<any, any>>,
  messages: MutationMessages,
) => Promise<void>;

export interface ApplicationStatusFormProps {
  id: string;
  onSubmit: MutationHandler;
}
