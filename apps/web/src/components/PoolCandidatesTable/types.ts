import type {
  ApplicationStatus,
  CandidateExpiryFilter,
  CandidateReferralFilter,
  CandidateRemovalReason,
  CandidateSuspendedFilter,
  EmployeeVerification,
  FlexibleWorkLocation,
  LanguageAbility,
  OperationalRequirement,
  PlacementType,
  PriorityWeight,
  ScreeningStage,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import type { TEmploymentDuration } from "@gc-digital-talent/i18n";

export interface FormValues {
  assessmentSteps: string[];
  classifications: string[];
  community?: string;
  departments: string[];
  employmentDuration?: TEmploymentDuration | "";
  equity: string[];
  expiryStatus?: CandidateExpiryFilter;
  referralStatuses?: CandidateReferralFilter[];
  statuses: ApplicationStatus[];
  flexibleWorkLocations: FlexibleWorkLocation[];
  govEmployee?: EmployeeVerification[];
  languageAbility?: LanguageAbility | "";
  operationalRequirement: OperationalRequirement[];
  placementTypes: PlacementType[];
  pools: string[];
  priorityWeight: PriorityWeight[];
  removalReasons: CandidateRemovalReason[];
  screeningStages: ScreeningStage[];
  skills: string[];
  stream: string[];
  suspendedStatus?: CandidateSuspendedFilter;
  workRegion: WorkRegion[];
}
