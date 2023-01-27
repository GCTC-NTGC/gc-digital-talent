import {
  ApplicantFilterInput,
  LanguageAbility,
  PoolStream,
  UserPoolFilterInput,
} from "~/api/generated";
import { SimpleClassification, SimplePool } from "~/types/pool";

export const NullSelection = "NULL_SELECTION";

export type Option<V> = { value: V; label: string; ariaLabel?: string };
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
  poolCandidates: UserPoolFilterInput;
  pools?: SimplePool[];
};

export type LocationState = BrowserHistoryState | null;

export type BrowserHistoryState = {
  applicantFilter?: ApplicantFilterInput;
  candidateCount: number;
  initialValues?: FormValues;
  selectedClassifications?: SimpleClassification[];
};
