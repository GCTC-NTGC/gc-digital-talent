import { faker } from "@faker-js/faker/locale/en";

import type {
  User,
  Classification,
  Department,
} from "@gc-digital-talent/graphql/schema-types";
import {
  Language,
  ProvinceOrTerritory,
  EvaluatedLanguageAbility,
  EstimatedLanguageAbility,
  ExecCoaching,
  Mentorship,
  OperationalRequirement,
  GovEmployeeType,
  CitizenshipStatus,
  ArmedForcesStatus,
  PositionDuration,
  IndigenousCommunity,
  FlexibleWorkLocation,
  WorkRegion,
} from "@gc-digital-talent/graphql/schema-types";

import type {
  GeneratedAwardExperience,
  GeneratedCommunityExperience,
  GeneratedEducationExperience,
  GeneratedPersonalExperience,
  GeneratedWorkExperience,
} from "./fakeExperiences";
import fakeClassifications from "./fakeClassifications";
import fakeDepartments from "./fakeDepartments";
import type { GeneratedPoolCandidate } from "./fakePoolCandidateTypes";
import toLocalizedEnum from "./fakeLocalizedEnum";

type GeneratedUser = User & {
  __typename: "User";
  experiences:
    | (
        | GeneratedAwardExperience
        | GeneratedCommunityExperience
        | GeneratedEducationExperience
        | GeneratedPersonalExperience
        | GeneratedWorkExperience
        | null
      )[]
    | null;
  poolCandidates?: (GeneratedPoolCandidate | null)[] | null | undefined;
};

const generateUser = (
  departments: Department[],
  classifications: Classification[], // all classifications

  awardExperiences: GeneratedAwardExperience[], // Experiences belonging to this user
  communityExperiences: GeneratedCommunityExperience[], // Experiences belonging to this user
  educationExperiences: GeneratedEducationExperience[], // Experiences belonging to this user
  personalExperiences: GeneratedPersonalExperience[], // Experiences belonging to this user
  workExperiences: GeneratedWorkExperience[], // Experiences belonging to this user

  poolCandidates: GeneratedPoolCandidate[] = [], // poolCandidates associating this user with a pool
  index: number,
): GeneratedUser => {
  faker.seed(index); // repeatable results

  return {
    __typename: "User",
    id: faker.string.uuid(),

    // Personal Info
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    telephone: faker.helpers.replaceSymbols("+###########"),
    preferredLang: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
      "LocalizedLanguage",
    ),
    preferredLanguageForInterview: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
      "LocalizedLanguage",
    ),
    preferredLanguageForExam: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
      "LocalizedLanguage",
    ),
    currentProvince: toLocalizedEnum(
      faker.helpers.arrayElement<ProvinceOrTerritory>(
        Object.values(ProvinceOrTerritory),
      ),
      "LocalizedProvinceOrTerritory",
    ),
    currentCity: faker.location.city(),
    citizenship: toLocalizedEnum(
      faker.helpers.arrayElement<CitizenshipStatus>(
        Object.values(CitizenshipStatus),
      ),
      "LocalizedCitizenshipStatus",
    ),
    armedForcesStatus: toLocalizedEnum(
      faker.helpers.arrayElement<ArmedForcesStatus>(
        Object.values(ArmedForcesStatus),
      ),
      "LocalizedArmedForcesStatus",
    ),

    // Language
    lookingForEnglish: faker.datatype.boolean(),
    lookingForFrench: faker.datatype.boolean(),
    lookingForBilingual: faker.datatype.boolean(),
    comprehensionLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
      "LocalizedEvaluatedLanguageAbility",
    ),
    writtenLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
      "LocalizedEvaluatedLanguageAbility",
    ),
    verbalLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
      "LocalizedEvaluatedLanguageAbility",
    ),
    estimatedLanguageAbility: toLocalizedEnum(
      faker.helpers.arrayElement<EstimatedLanguageAbility>(
        Object.values(EstimatedLanguageAbility),
      ),
      "LocalizedEstimatedLanguageAbility",
    ),

    // Gov info
    isGovEmployee: faker.datatype.boolean(),
    workEmail: faker.internet.username() + "@gc.ca",
    govEmployeeType: toLocalizedEnum(
      faker.helpers.arrayElement<GovEmployeeType>(
        Object.values(GovEmployeeType),
      ),
      "LocalizedGovEmployeeType",
    ),
    department: faker.helpers.arrayElement<Department>(departments),
    currentClassification:
      faker.helpers.arrayElement<Classification>(classifications),
    hasPriorityEntitlement: faker.datatype.boolean(),

    // Employment Equity
    isWoman: faker.datatype.boolean(),
    hasDisability: faker.datatype.boolean(),
    isVisibleMinority: faker.datatype.boolean(),
    indigenousCommunities: faker.helpers
      .arrayElements<IndigenousCommunity>(Object.values(IndigenousCommunity))
      .map((community) =>
        toLocalizedEnum(community, "LocalizedIndigenousCommunity"),
      ),

    // Applicant info
    hasDiploma: faker.datatype.boolean(),
    locationPreferences: faker.helpers
      .arrayElements<WorkRegion>(Object.values(WorkRegion))
      .map((pref) => toLocalizedEnum(pref, "LocalizedWorkRegion")),
    flexibleWorkLocations: faker.helpers
      .arrayElements<FlexibleWorkLocation>(Object.values(FlexibleWorkLocation))
      .map((pref) => toLocalizedEnum(pref, "LocalizedFlexibleWorkLocation")),
    locationExemptions: faker.location.city(),
    acceptedOperationalRequirements: faker.helpers
      .arrayElements<OperationalRequirement>(
        Object.values(OperationalRequirement),
      )
      .map((req) => toLocalizedEnum(req, "LocalizedOperationalRequirement")),
    positionDuration: faker.datatype.boolean()
      ? [PositionDuration.Permanent]
      : [PositionDuration.Permanent, PositionDuration.Temporary],
    poolCandidates,

    experiences: [
      ...awardExperiences,
      ...communityExperiences,
      ...educationExperiences,
      ...personalExperiences,
      ...workExperiences,
    ],
    awardExperiences,
    communityExperiences,
    educationExperiences,
    personalExperiences,
    workExperiences,

    userSkills: [],
  };
};

// Default generator will not include any experiences, poolCandidates or pools
const defaultGenerator = (numToGenerate = 20): GeneratedUser[] => {
  const departments = fakeDepartments();
  const classifications = fakeClassifications();

  const awardExperiences: GeneratedAwardExperience[] = [];
  const communityExperiences: GeneratedCommunityExperience[] = [];
  const educationExperiences: GeneratedEducationExperience[] = [];
  const personalExperiences: GeneratedPersonalExperience[] = [];
  const workExperiences: GeneratedWorkExperience[] = [];

  return Array.from({ length: numToGenerate }, (_x, index) =>
    generateUser(
      departments,
      classifications,
      awardExperiences,
      communityExperiences,
      educationExperiences,
      personalExperiences,
      workExperiences,
      [],
      index,
    ),
  );
};

export const fakeApplicants = (numToGenerate = 20): GeneratedUser[] => {
  return defaultGenerator(numToGenerate);
};

export const fakeUser = () => {
  const departments = fakeDepartments();
  const classifications = fakeClassifications();
  const lookingForBilingual = faker.datatype.boolean();
  const secondLanguageExamCompleted = lookingForBilingual
    ? faker.datatype.boolean()
    : null;
  const hasPriorityEntitlement = faker.datatype.boolean();
  const eligibleRetirementYearKnown = faker.datatype.boolean();

  return {
    __typename: "User" as const,
    id: faker.string.uuid(),

    // Personal Info
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    telephone: faker.helpers.replaceSymbols("+###########"),
    preferredLang: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
      "LocalizedLanguage",
    ),
    preferredLanguageForInterview: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
      "LocalizedLanguage",
    ),
    preferredLanguageForExam: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
      "LocalizedLanguage",
    ),
    currentProvince: toLocalizedEnum(
      faker.helpers.arrayElement<ProvinceOrTerritory>(
        Object.values(ProvinceOrTerritory),
      ),
      "LocalizedProvinceOrTerritory",
    ),
    currentCity: faker.location.city(),
    citizenship: toLocalizedEnum(
      faker.helpers.arrayElement<CitizenshipStatus>(
        Object.values(CitizenshipStatus),
      ),
      "LocalizedCitizenshipStatus",
    ),
    armedForcesStatus: toLocalizedEnum(
      faker.helpers.arrayElement<ArmedForcesStatus>(
        Object.values(ArmedForcesStatus),
      ),
      "LocalizedArmedForcesStatus",
    ),

    // Language
    lookingForEnglish: faker.datatype.boolean(),
    lookingForFrench: faker.datatype.boolean(),
    lookingForBilingual,
    firstOfficialLanguage: lookingForBilingual
      ? toLocalizedEnum(
          faker.helpers.arrayElement<Language>(Object.values(Language)),
          "LocalizedLanguage",
        )
      : null,
    secondLanguageExamCompleted,
    secondLanguageExamValidity: secondLanguageExamCompleted
      ? faker.datatype.boolean()
      : null,
    comprehensionLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
      "LocalizedEvaluatedLanguageAbility",
    ),
    writtenLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
      "LocalizedEvaluatedLanguageAbility",
    ),
    verbalLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
      "LocalizedEvaluatedLanguageAbility",
    ),
    estimatedLanguageAbility: toLocalizedEnum(
      faker.helpers.arrayElement<EstimatedLanguageAbility>(
        Object.values(EstimatedLanguageAbility),
      ),
      "LocalizedEstimatedLanguageAbility",
    ),

    // Gov info
    isGovEmployee: faker.datatype.boolean(),
    workEmail: faker.internet.username() + "@gc.ca",
    govEmployeeType: toLocalizedEnum(
      faker.helpers.arrayElement<GovEmployeeType>(
        Object.values(GovEmployeeType),
      ),
      "LocalizedGovEmployeeType",
    ),
    department: faker.helpers.arrayElement<Department>(departments),
    currentClassification:
      faker.helpers.arrayElement<Classification>(classifications),
    hasPriorityEntitlement,
    priorityNumber: hasPriorityEntitlement ? faker.lorem.word() : null,

    // Employment Equity
    isWoman: faker.datatype.boolean(),
    hasDisability: faker.datatype.boolean(),
    isVisibleMinority: faker.datatype.boolean(),
    indigenousCommunities: faker.helpers
      .arrayElements<IndigenousCommunity>(Object.values(IndigenousCommunity))
      .map((community) =>
        toLocalizedEnum(community, "LocalizedIndigenousCommunity"),
      ),

    // Applicant info
    hasDiploma: faker.datatype.boolean(),
    locationPreferences: faker.helpers
      .arrayElements<WorkRegion>(Object.values(WorkRegion))
      .map((pref) => toLocalizedEnum(pref, "LocalizedWorkRegion")),
    flexibleWorkLocations: faker.helpers
      .arrayElements<FlexibleWorkLocation>(Object.values(FlexibleWorkLocation))
      .map((pref) => toLocalizedEnum(pref, "LocalizedFlexibleWorkLocation")),
    locationExemptions: faker.location.city(),
    acceptedOperationalRequirements: faker.helpers
      .arrayElements<OperationalRequirement>(
        Object.values(OperationalRequirement),
      )
      .map((req) => toLocalizedEnum(req, "LocalizedOperationalRequirement")),
    positionDuration: faker.datatype.boolean()
      ? [PositionDuration.Permanent]
      : [PositionDuration.Permanent, PositionDuration.Temporary],
    experiences: [],
    userSkills: [],
    talentNominationsAsSubmitter: [],
    talentRequests: [],

    // Employee profile
    employeeProfile: {
      __typename: "EmployeeProfile" as const,
      lateralMoveInterest: faker.datatype.boolean(),
      promotionMoveInterest: faker.datatype.boolean(),
      execInterest: faker.datatype.boolean(),
      eligibleRetirementYearKnown,
      eligibleRetirementYear: eligibleRetirementYearKnown
        ? faker.date
            .between({ from: "2030-01-01", to: "2049-12-31" })
            .toISOString()
            .slice(0, 10)
        : null,
      mentorshipStatus: faker.helpers
        .arrayElements<Mentorship>(Object.values(Mentorship))
        .map((status) => toLocalizedEnum(status, "LocalizedMentorship")),
      execCoachingStatus: faker.helpers
        .arrayElements<ExecCoaching>(Object.values(ExecCoaching))
        .map((status) => toLocalizedEnum(status, "LocalizedExecCoaching")),
      communityInterests: [],
    },
  };
};

export default defaultGenerator;
