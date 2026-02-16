import {
  ApplicationStatus,
  CandidateExpiryFilter,
  CandidateRemovalReason,
  CandidateSuspendedFilter,
  FlexibleWorkLocation,
  LanguageAbility,
  OperationalRequirement,
  PlacementType,
  PriorityWeight,
  PublishingGroup,
  ScreeningStage,
  WorkRegion,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  assessmentSteps: string[];
  classifications: string[];
  community?: string;
  departments: string[];
  equity: string[];
  expiryStatus?: CandidateExpiryFilter;
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
