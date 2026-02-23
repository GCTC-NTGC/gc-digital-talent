import {
  ApplicationStatus,
  CandidateRemovalReason,
  DisqualificationReason,
  PlacementType,
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
}

export interface ApplicationStatusFormProps {
  id: Scalars["UUID"]["output"];
  onSubmit?: () => void;
}
