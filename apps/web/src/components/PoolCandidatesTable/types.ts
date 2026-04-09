import {
  type ApplicationStatus,
  type CandidateExpiryFilter,
  type CandidateReferralFilter,
  type CandidateRemovalReason,
  type CandidateSuspendedFilter,
  type FlexibleWorkLocation,
  type LanguageAbility,
  type OperationalRequirement,
  type PlacementType,
  type PriorityWeight,
  type PublishingGroup,
  type ScreeningStage,
  type WorkRegion,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  assessmentSteps: string[];
  classifications: string[];
  community?: string;
  departments: string[];
  equity: string[];
  expiryStatus?: CandidateExpiryFilter;
  referralStatuses?: CandidateReferralFilter[];
  statuses: ApplicationStatus[];
  flexibleWorkLocations: FlexibleWorkLocation[];
  govEmployee?: string;
  languageAbility?: LanguageAbility;
  operationalRequirement: OperationalRequirement[];
  placementTypes: PlacementType[];
  pools: string[];
  priorityWeight: PriorityWeight[];
  publishingGroups: PublishingGroup[];
  removalReasons: CandidateRemovalReason[];
  screeningStages: ScreeningStage[];
  skills: string[];
  stream: string[];
  suspendedStatus?: CandidateSuspendedFilter;
  workRegion: WorkRegion[];
}
