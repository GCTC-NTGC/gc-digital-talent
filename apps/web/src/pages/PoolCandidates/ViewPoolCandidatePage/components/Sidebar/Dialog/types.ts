import { MessageDescriptor } from "react-intl";
import { OperationResult } from "urql";

import {
  ApplicationStatus,
  CandidateRemovalReason,
  DisqualificationReason,
  PlacementType,
  ReferralPauseLength,
  Scalars,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  status?: ApplicationStatus;
  expiryDate?: Scalars["Date"]["input"];
  placementType?: PlacementType;
  department?: Scalars["UUID"]["input"];
  disqualificationReason?: DisqualificationReason;
  removalReason?: CandidateRemovalReason;
  removalReasonOther?: Scalars["String"]["input"];
  referralPauseStatus: boolean;
  referralPauseLength?: ReferralPauseLength;
  referralUnpauseAt?: Scalars["Date"]["input"];
  referralPauseReason?: string;
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
  id: Scalars["UUID"]["output"];
  onSubmit: MutationHandler;
}
