import type {
  ApplicantFilterInput,
  LanguageAbility,
  UserPoolFilterInput,
  Classification,
  ApplicantFilter,
  Pool,
  PoolCandidateFilter,
  PoolCandidateSearchRequest,
} from "@gc-digital-talent/graphql";

export const NullSelection = "NULL_SELECTION";

export type FormValues = Pick<
  ApplicantFilterInput,
  "locationPreferences" | "operationalRequirements" | "flexibleWorkLocations"
> & {
  languageAbility: LanguageAbility | typeof NullSelection;
  employmentDuration: string;
  classification: string | undefined;
  stream?: string;
  skills: string[] | undefined;
  employmentEquity: string[] | undefined;
  educationRequirement: "has_diploma" | "no_diploma";
  poolCandidates?: UserPoolFilterInput;
  pool?: string;
  selectedClassifications?: Pick<
    Classification,
    "group" | "level" | "groupAndLevel"
  >[];
  count?: number;
  allPools?: boolean; // Prevent `was_empty` when requesting all pools
};

export type LocationState = BrowserHistoryState | null;

export interface BrowserHistoryState {
  applicantFilter?: ApplicantFilterInput;
  candidateCount: number;
  initialValues?: FormValues;
  selectedClassifications?: Pick<Classification, "groupAndLevel">[];
  allPools?: boolean;
}

export type PartialApplicantFilter = Omit<ApplicantFilter, "pools"> & {
  pools?: (Omit<Pool, "activities" | "teamId"> | null)[] | null;
};

export type PartialPoolCandidateFilter = Omit<PoolCandidateFilter, "pools"> & {
  pools?: (Omit<Pool, "activities" | "teamId"> | null)[] | null;
};

export type PartialSearchRequest = Omit<
  PoolCandidateSearchRequest,
  "applicantFilter" | "poolCandidateFilter"
> & {
  applicantFilter?: PartialApplicantFilter | null;
  poolCandidateFilter?: PartialPoolCandidateFilter | null;
};
