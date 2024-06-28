import {
  Scalars,
  ApplicantFilterInput,
  LanguageAbility,
  PoolStream,
  UserPoolFilterInput,
  Classification,
} from "@gc-digital-talent/graphql";

export const NullSelection = "NULL_SELECTION";

export type FormValues = Pick<
  ApplicantFilterInput,
  "locationPreferences" | "operationalRequirements"
> & {
  languageAbility: LanguageAbility | typeof NullSelection;
  employmentDuration: string | typeof NullSelection;
  classification: string | undefined;
  stream: PoolStream | "";
  skills: string[] | undefined;
  employmentEquity: string[] | undefined;
  educationRequirement: "has_diploma" | "no_diploma";
  poolCandidates?: UserPoolFilterInput;
  pool?: Scalars["ID"]["output"];
  selectedClassifications?: Classification[];
  count?: number;
  allPools?: boolean; // Prevent `was_empty` when requesting all pools
};

export type LocationState = BrowserHistoryState | null;

export type BrowserHistoryState = {
  applicantFilter?: ApplicantFilterInput;
  candidateCount: number;
  initialValues?: FormValues;
  selectedClassifications?: Classification[];
  allPools?: boolean;
};
