import {
  Scalars,
  ApplicantFilterInput,
  LanguageAbility,
  UserPoolFilterInput,
  Classification,
} from "@gc-digital-talent/graphql";

export const NullSelection = "NULL_SELECTION";

export type FormValues = Pick<
  ApplicantFilterInput,
  "locationPreferences" | "operationalRequirements"
> & {
  languageAbility: LanguageAbility | typeof NullSelection;
  employmentDuration: string;
  classification: string | undefined;
  stream?: string;
  skills: string[] | undefined;
  employmentEquity: string[] | undefined;
  educationRequirement: "has_diploma" | "no_diploma";
  poolCandidates?: UserPoolFilterInput;
  pool?: Scalars["ID"]["output"];
  selectedClassifications?: Pick<Classification, "group" | "level">[];
  count?: number;
  allPools?: boolean; // Prevent `was_empty` when requesting all pools
};

export type LocationState = BrowserHistoryState | null;

export interface BrowserHistoryState {
  applicantFilter?: ApplicantFilterInput;
  candidateCount: number;
  initialValues?: FormValues;
  selectedClassifications?: Pick<Classification, "group" | "level">[];
  allPools?: boolean;
}
