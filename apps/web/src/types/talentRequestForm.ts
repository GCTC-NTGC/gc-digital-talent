import type {
  ApplicantFilterInput,
  FlexibleWorkLocation,
  LanguageAbility,
  LocalizedString,
  OperationalRequirement,
  PositionDuration,
  PublishingGroup,
  TalentRequestSource,
  UserPoolFilterInput,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

export const NullSelection = "NULL_SELECTION";

export interface TalentRequestClassification {
  group: string;
  level: number;
  groupAndLevel: string;
  displayName: string;
  name?: LocalizedString | null;
}

export interface TalentRequestWorkStream {
  id: string;
  name?: LocalizedString | null;
}

export type FormValues = Pick<
  ApplicantFilterInput,
  | "locationPreferences"
  | "operationalRequirements"
  | "flexibleWorkLocations"
  | "talentSources"
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
  communityId?: string;
  selectedClassifications?: TalentRequestClassification[];
  count?: number;
};

interface PartialApplicantFilterSkill {
  id: string;
  name?: LocalizedString | null;
}

interface PartialApplicantFilterPool {
  id: string;
  name?: LocalizedString | null;
  publishingGroup?: GenericLocalizedEnum<PublishingGroup> | null;
  workStream?: TalentRequestWorkStream | null;
  classification?: { groupAndLevel: string } | null;
}

interface PartialApplicantFilterEquity {
  hasDisability?: boolean | null;
  isIndigenous?: boolean | null;
  isVisibleMinority?: boolean | null;
  isWoman?: boolean | null;
}

export interface PartialApplicantFilter {
  __typename?: "ApplicantFilter";
  id: string;
  community?: { name?: LocalizedString | null } | null;
  equity?: PartialApplicantFilterEquity | null;
  flexibleWorkLocations?:
    (GenericLocalizedEnum<FlexibleWorkLocation> | null)[] | null;
  hasDiploma?: boolean | null;
  languageAbility?: GenericLocalizedEnum<LanguageAbility> | null;
  locationPreferences?: (GenericLocalizedEnum<WorkRegion> | null)[] | null;
  operationalRequirements?:
    (GenericLocalizedEnum<OperationalRequirement> | null)[] | null;
  pools?: (PartialApplicantFilterPool | null)[] | null;
  positionDuration?: (PositionDuration | null)[] | null;
  qualifiedInClassifications?: (TalentRequestClassification | null)[] | null;
  qualifiedInWorkStreams?: TalentRequestWorkStream[] | null;
  skills?: (PartialApplicantFilterSkill | null)[] | null;
  talentSources?: GenericLocalizedEnum<TalentRequestSource>[] | null;
}
