import { IntlShape } from "react-intl";

import {
  AwardedScope,
  AwardedTo,
  CandidateRemovalReason,
  EducationStatus,
  EducationType,
  LocalizedEnumString,
  LocalizedString,
  Maybe,
  PlacementType,
  PoolCandidateSearchRequestReason,
  PoolCandidateSearchStatus,
  PoolLanguage,
  PoolOpportunityLength,
  PriorityWeight,
  SecurityStatus,
  WorkRegion,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

// eslint-disable-next-line import/prefer-default-export
export const SkillCategoryStrings_Fragment = graphql(/* GraphQL */ `
  fragment SkillCategoryStrings on Query {
    skillCategories: localizedEnumStrings(enumName: "SkillCategory") {
      value
      label {
        en
        fr
      }
    }
  }
`);

type MaybeLocalizedEnums = Maybe<Maybe<LocalizedEnumString>[]>;

type GenericLocalizedEnum<T> = {
  value: T;
  label: LocalizedString;
};

export function getLocalizedEnumByValue(
  value: Maybe<string> | undefined,
  localizedEnumArray: MaybeLocalizedEnums | undefined,
) {
  return localizedEnumArray?.find(
    (localizedEnum) => localizedEnum?.value === value,
  );
}

export function getLocalizedEnumStringByValue(
  value: string,
  localizedEnumArray: MaybeLocalizedEnums | undefined,
  intl: IntlShape,
  emptyNotFound: boolean = false,
) {
  return getLocalizedName(
    getLocalizedEnumByValue(value, localizedEnumArray)?.label,
    intl,
    emptyNotFound,
  );
}

function sortLocalizedEnums(
  orderArray: string[],
  localizedEnumArray?: MaybeLocalizedEnums,
) {
  return unpackMaybes(localizedEnumArray).sort(
    (a, b) => orderArray.indexOf(a.value) - orderArray.indexOf(b.value),
  );
}

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
      PoolCandidateSearchRequestReason.UpcomingNeed,
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
