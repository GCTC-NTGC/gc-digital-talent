import {
  CandidateExpiryFilter,
  CandidateRemovalReason,
  CandidateSuspendedFilter,
  FinalDecision,
  FlexibleWorkLocation,
  LanguageAbility,
  OperationalRequirement,
  PlacementType,
  PoolCandidateStatus,
  PriorityWeight,
  PublishingGroup,
  WorkRegion,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  assessmentSteps: string[];
  classifications: string[];
  community?: string;
  departments: string[];
  equity: string[];
  expiryStatus?: CandidateExpiryFilter;
  finalDecisions: FinalDecision[];
  flexibleWorkLocations: FlexibleWorkLocation[];
  govEmployee?: string;
  languageAbility?: LanguageAbility;
  operationalRequirement: OperationalRequirement[];
  placementTypes: PlacementType[];
  poolCandidateStatus: PoolCandidateStatus[];
  pools: string[];
  priorityWeight: PriorityWeight[];
  publishingGroups: PublishingGroup[];
  removalReasons: CandidateRemovalReason[];
  skills: string[];
  stream: string[];
  suspendedStatus?: CandidateSuspendedFilter;
  workRegion: WorkRegion[];
}
