import { IntlShape } from "react-intl";

import {
  ApplicationStatus,
  AwardedScope,
  AwardedTo,
  CandidateRemovalReason,
  CandidateStatus,
  EducationStatus,
  EducationType,
  EvaluatedLanguageAbility,
  FlexibleWorkLocation,
  LocalizedEnumString,
  LocalizedString,
  Maybe,
  PlacementType,
  PoolCandidateSearchRequestReason,
  PoolCandidateSearchStatus,
  PoolLanguage,
  PoolOpportunityLength,
  PriorityWeight,
  ScreeningStage,
  SecurityStatus,
  WfaInterest,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getLocalizedName } from "./localize";

export type MaybeLocalizedEnums = Maybe<Maybe<LocalizedEnumString>[]>;

export interface GenericLocalizedEnum<T> {
  value: T;
  label: LocalizedString;
}

/**
 * Retrieve the full localized enum from an array
 * of them based of a value
 *
 * @param value - The value of the enum case
 * @param localizedEnumArray - Array of localized enums strings
 * @returns The full localized enum found, or null
 */
export function getLocalizedEnumByValue(
  value: Maybe<string> | undefined,
  localizedEnumArray: MaybeLocalizedEnums | undefined,
) {
  return localizedEnumArray?.find(
    (localizedEnum) => localizedEnum?.value === value,
  );
}

/**
 * Get the current locale string of an enum by value
 *
 * @param value - The value of the enum case
 * @param localizedEnumArray - Array of localized enum strings
 * @param intl react-intl object
 * @param [emptyNotFound=false] - If true, return empty string when not found instead of message
 * @returns string
 */
export function getLocalizedEnumStringByValue(
  value: Maybe<string> | undefined,
  localizedEnumArray: MaybeLocalizedEnums | undefined,
  intl: IntlShape,
  emptyNotFound = false,
) {
  return getLocalizedName(
    getLocalizedEnumByValue(value, localizedEnumArray)?.label,
    intl,
    emptyNotFound,
  );
}

/**
 * Sorts an array of localized enums
 * based on a sorted array of values
 *
 * @param orderArray - Array with target sorting of values
 * @param localizedEnumArray  - Array of localized enums to be sorted
 * @returns The sorted array of localized enums
 */
function sortLocalizedEnums(
  orderArray: string[],
  localizedEnumArray?: MaybeLocalizedEnums,
) {
  return unpackMaybes(localizedEnumArray).sort(
    (a, b) => orderArray.indexOf(a.value) - orderArray.indexOf(b.value),
  );
}

/**
 * Sorts an array of localized enums where we know the value (not just a string)
 * based on a sorted array of values
 *
 * @param orderArray - Array with target sorting of values
 * @param localizedEnumArray  - Array of localized enums to be sorted
 * @returns The sorted array of localized enums
 */
export function sortLocalizedEnumOptions<T extends string>(
  orderArray: string[],
  localizedEnumArray?: GenericLocalizedEnum<T>[],
) {
  return unpackMaybes(localizedEnumArray).sort(
    (a, b) => orderArray.indexOf(a.value) - orderArray.indexOf(b.value),
  );
}

/**
 * Converts an a form input value to a typecast localized enum
 *
 * @param input - The input value
 * @param localizedEnumArray - Array of localized enum strings
 * @returns The found localized enum
 */
export function enumInputToLocalizedEnum<T extends string>(
  input: Maybe<T> | undefined,
  localizedEnumArray?: MaybeLocalizedEnums,
) {
  return input
    ? (getLocalizedEnumByValue(input, localizedEnumArray) as Maybe<
        GenericLocalizedEnum<T>
      >)
    : undefined;
}

/**
 * Get the value from a localized enum for graphql inputs
 *
 * @param localizedEnum - The localized enum
 * @returns string
 */
export function localizedEnumToInput<T>(
  localizedEnum?: Maybe<GenericLocalizedEnum<T>>,
): Maybe<T> | undefined {
  return localizedEnum?.value;
}

/**
 * Converts an array of localized enums to graphql input values
 *
 * @param localizedEnumArray - Array of localized enums
 * @returns Input values
 */
export function localizedEnumArrayToInput<T>(
  localizedEnumArray?: Maybe<Maybe<GenericLocalizedEnum<T>>[]>,
): Maybe<Maybe<T>[] | undefined> | undefined {
  return unpackMaybes(
    localizedEnumArray?.map((localizedEnum) =>
      localizedEnumToInput(localizedEnum),
    ),
  );
}

export const ENUM_SORT_ORDER = {
  APPLICATION_STATUS: [
    ApplicationStatus.Draft,
    ApplicationStatus.ToAssess,
    ApplicationStatus.Qualified,
    ApplicationStatus.Disqualified,
    ApplicationStatus.Removed,
  ],
  CANDIDATE_STATUS: [
    CandidateStatus.Draft,
    CandidateStatus.Received,
    CandidateStatus.UnderReview,
    CandidateStatus.ApplicationReviewed,
    CandidateStatus.UnderAssessment,
    CandidateStatus.Qualified,
    CandidateStatus.Unsuccessful,
    CandidateStatus.Expired,
    null,
  ],
  FLEXIBLE_WORK_LOCATION: [
    FlexibleWorkLocation.Remote,
    FlexibleWorkLocation.Hybrid,
    FlexibleWorkLocation.Onsite,
  ],
  PLACEMENT_TYPE: [
    PlacementType.NotPlaced,
    PlacementType.UnderConsideration,
    PlacementType.PlacedTentative,
    PlacementType.PlacedCasual,
    PlacementType.PlacedTerm,
    PlacementType.PlacedIndeterminate,
  ],
  PRIORITY_WEIGHT: [
    PriorityWeight.PriorityEntitlement,
    PriorityWeight.Veteran,
    PriorityWeight.CitizenOrPermanentResident,
    PriorityWeight.Other,
  ],
  SCREENING_STAGE: [
    ScreeningStage.NewApplication,
    ScreeningStage.ApplicationReview,
    ScreeningStage.ScreenedIn,
    ScreeningStage.UnderAssessment,
  ],
  WORK_REGION: [
    WorkRegion.Telework,
    WorkRegion.NationalCapital,
    WorkRegion.Atlantic,
    WorkRegion.Quebec,
    WorkRegion.Ontario,
    WorkRegion.North,
    WorkRegion.Prairie,
    WorkRegion.BritishColumbia,
  ],
};

/**
 * Filters and narrows a list of GraphQL enum option objects to only those matching the queried enum type.
 *
 * @template T - The union type of all possible enum option objects (from codegen).
 * @template EnumName - The enum name you queried for, as a string (e.g., 'CafRank').
 * @param options - The array of enum option objects returned from your GraphQL query.
 * @param enumName - The enum name as passed to your query (e.g., 'CafRank').
 * @returns - The filtered and type-narrowed array containing only objects for the requested enum.
 */
export function narrowEnumType<
  T extends { __typename?: string },
  EnumName extends string,
>(
  items: readonly T[],
  enumName: EnumName,
): Extract<T, { __typename?: `Localized${EnumName}` }>[] {
  const typename = `Localized${enumName}` as const;
  return items.filter(
    (item): item is Extract<T, { __typename?: `Localized${EnumName}` }> =>
      typeof item.__typename === "string" && item.__typename === typename,
  );
}

export function sortAwardedTo(awardTo?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      AwardedTo.Me,
      AwardedTo.MyTeam,
      AwardedTo.MyProject,
      AwardedTo.MyOrganization,
    ],
    awardTo,
  );
}

export function sortAwardedScope(awardedScopes?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      AwardedScope.International,
      AwardedScope.National,
      AwardedScope.Provincial,
      AwardedScope.Local,
      AwardedScope.Community,
      AwardedScope.Organizational,
      AwardedScope.SubOrganizational,
    ],
    awardedScopes,
  );
}

export function sortCandidateRemovalReason(
  removalReasons?: MaybeLocalizedEnums,
) {
  return sortLocalizedEnums(
    [
      CandidateRemovalReason.RequestedToBeWithdrawn,
      CandidateRemovalReason.NotResponsive,
      CandidateRemovalReason.Ineligible,
      CandidateRemovalReason.Other,
    ],
    removalReasons,
  );
}

export function sortEducationType(educationTypes?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      EducationType.Diploma,
      EducationType.BachelorsDegree,
      EducationType.MastersDegree,
      EducationType.Phd,
      EducationType.PostDoctoralFellowship,
      EducationType.OnlineCourse,
      EducationType.Certification,
      EducationType.Other,
    ],
    educationTypes,
  );
}

export function sortEducationStatus(educationStatuses?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      EducationStatus.SuccessCredential,
      EducationStatus.SuccessNoCredential,
      EducationStatus.InProgress,
      EducationStatus.Audited,
      EducationStatus.DidNotComplete,
    ],
    educationStatuses,
  );
}

export function sortEvaluatedLanguageAbility(
  evaluatedLanguageAbilities?: MaybeLocalizedEnums,
) {
  return sortLocalizedEnums(
    [
      EvaluatedLanguageAbility.P,
      EvaluatedLanguageAbility.E,
      EvaluatedLanguageAbility.C,
      EvaluatedLanguageAbility.B,
      EvaluatedLanguageAbility.A,
      EvaluatedLanguageAbility.X,
      EvaluatedLanguageAbility.NotAssessed,
    ],
    evaluatedLanguageAbilities,
  );
}

export function sortOpportunityLength(
  opportunityLengths?: MaybeLocalizedEnums,
) {
  return sortLocalizedEnums(
    [
      PoolOpportunityLength.TermSixMonths,
      PoolOpportunityLength.TermOneYear,
      PoolOpportunityLength.TermTwoYears,
      PoolOpportunityLength.Indeterminate,
      PoolOpportunityLength.Various,
    ],
    opportunityLengths,
  );
}

export function sortPlacementType(placementTypes?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      PlacementType.NotPlaced,
      PlacementType.UnderConsideration,
      PlacementType.PlacedTentative,
      PlacementType.PlacedCasual,
      PlacementType.PlacedTerm,
      PlacementType.PlacedIndeterminate,
    ],
    placementTypes,
  );
}

export function sortPoolCandidateSearchRequestReason(
  poolCandidateSearchRequestReasons?: MaybeLocalizedEnums,
) {
  return sortLocalizedEnums(
    [
      PoolCandidateSearchRequestReason.ImmediateHire,
      PoolCandidateSearchRequestReason.UpcomingNeed,
      PoolCandidateSearchRequestReason.GeneralInterest,
    ],
    poolCandidateSearchRequestReasons,
  );
}

export function sortPoolCandidateSearchStatus(
  poolCandidateSearchStatuses?: MaybeLocalizedEnums,
) {
  return sortLocalizedEnums(
    [
      PoolCandidateSearchStatus.New,
      PoolCandidateSearchStatus.InProgress,
      PoolCandidateSearchStatus.Waiting,
      PoolCandidateSearchStatus.Done,
      PoolCandidateSearchStatus.DoneNoCandidates,
    ],
    poolCandidateSearchStatuses,
  );
}

export function sortPoolLanguage(poolLanguages?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      PoolLanguage.Various,
      PoolLanguage.English,
      PoolLanguage.French,
      PoolLanguage.BilingualIntermediate,
      PoolLanguage.BilingualAdvanced,
    ],
    poolLanguages,
  );
}

export function sortPriorityWeight(priorityWeights?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      PriorityWeight.PriorityEntitlement,
      PriorityWeight.Veteran,
      PriorityWeight.CitizenOrPermanentResident,
      PriorityWeight.Other,
    ],
    priorityWeights,
  );
}

export function sortSecurityStatus(securityStatuses?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      SecurityStatus.Reliability,
      SecurityStatus.Secret,
      SecurityStatus.TopSecret,
    ],
    securityStatuses,
  );
}

export function sortWorkRegion(workRegions?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      WorkRegion.Telework,
      WorkRegion.NationalCapital,
      WorkRegion.Atlantic,
      WorkRegion.Quebec,
      WorkRegion.Ontario,
      WorkRegion.North,
      WorkRegion.Prairie,
      WorkRegion.BritishColumbia,
    ],
    workRegions,
  );
}

export function sortFlexibleWorkLocations(
  flexibleWorkLocationOptions?: MaybeLocalizedEnums,
) {
  return sortLocalizedEnums(
    [
      FlexibleWorkLocation.Remote,
      FlexibleWorkLocation.Hybrid,
      FlexibleWorkLocation.Onsite,
    ],
    flexibleWorkLocationOptions,
  );
}

export function sortWfaInterest(wfaInterests?: MaybeLocalizedEnums) {
  return sortLocalizedEnums(
    [
      WfaInterest.NotApplicable,
      WfaInterest.TermEnding,
      WfaInterest.LetterReceived,
      WfaInterest.NotSure,
      WfaInterest.VoluntaryDeparture,
    ],
    wfaInterests,
  );
}
