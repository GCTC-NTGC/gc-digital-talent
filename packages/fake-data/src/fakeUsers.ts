import { faker } from "@faker-js/faker/locale/en";

import {
  User,
  Language,
  ProvinceOrTerritory,
  EvaluatedLanguageAbility,
  EstimatedLanguageAbility,
  Classification,
  OperationalRequirement,
  WorkRegion,
  GovEmployeeType,
  Department,
  CitizenshipStatus,
  ArmedForcesStatus,
  PositionDuration,
  IndigenousCommunity,
  Maybe,
} from "@gc-digital-talent/graphql";

import {
  GeneratedAwardExperience,
  GeneratedCommunityExperience,
  GeneratedEducationExperience,
  GeneratedPersonalExperience,
  GeneratedWorkExperience,
} from "./fakeExperiences";
import fakeClassifications from "./fakeClassifications";
import fakeDepartments from "./fakeDepartments";
import { GeneratedPoolCandidate } from "./fakePoolCandidateTypes";
import toLocalizedEnum from "./fakeLocalizedEnum";

type GeneratedUser = User & {
  __typename: "User";
  experiences: Maybe<
    Maybe<
      | GeneratedAwardExperience
      | GeneratedCommunityExperience
      | GeneratedEducationExperience
      | GeneratedPersonalExperience
      | GeneratedWorkExperience
    >[]
  >;
  poolCandidates?: Maybe<Maybe<GeneratedPoolCandidate>[]>;
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
    ),
    preferredLanguageForInterview: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
    ),
    preferredLanguageForExam: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
    ),
    currentProvince: toLocalizedEnum(
      faker.helpers.arrayElement<ProvinceOrTerritory>(
        Object.values(ProvinceOrTerritory),
      ),
    ),
    currentCity: faker.location.city(),
    citizenship: toLocalizedEnum(
      faker.helpers.arrayElement<CitizenshipStatus>(
        Object.values(CitizenshipStatus),
      ),
    ),
    armedForcesStatus: toLocalizedEnum(
      faker.helpers.arrayElement<ArmedForcesStatus>(
        Object.values(ArmedForcesStatus),
      ),
    ),

    // Language
    lookingForEnglish: faker.datatype.boolean(),
    lookingForFrench: faker.datatype.boolean(),
    lookingForBilingual: faker.datatype.boolean(),
    comprehensionLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
    ),
    writtenLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
    ),
    verbalLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
    ),
    estimatedLanguageAbility: toLocalizedEnum(
      faker.helpers.arrayElement<EstimatedLanguageAbility>(
        Object.values(EstimatedLanguageAbility),
      ),
    ),

    // Gov info
    isGovEmployee: faker.datatype.boolean(),
    workEmail: faker.internet.email(),
    govEmployeeType: toLocalizedEnum(
      faker.helpers.arrayElement<GovEmployeeType>(
        Object.values(GovEmployeeType),
      ),
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
      .map((community) => toLocalizedEnum(community)),

    // Applicant info
    hasDiploma: faker.datatype.boolean(),
    locationPreferences: faker.helpers
      .arrayElements<WorkRegion>(Object.values(WorkRegion))
      .map((pref) => toLocalizedEnum(pref)),
    locationExemptions: faker.location.city(),
    acceptedOperationalRequirements: faker.helpers
      .arrayElements<OperationalRequirement>(
        Object.values(OperationalRequirement),
      )
      .map((req) => toLocalizedEnum(req)),
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

export const fakeUser = (): User => {
  const departments = fakeDepartments();
  const classifications = fakeClassifications();

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
    ),
    preferredLanguageForInterview: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
    ),
    preferredLanguageForExam: toLocalizedEnum(
      faker.helpers.arrayElement<Language>(Object.values(Language)),
    ),
    currentProvince: toLocalizedEnum(
      faker.helpers.arrayElement<ProvinceOrTerritory>(
        Object.values(ProvinceOrTerritory),
      ),
    ),
    currentCity: faker.location.city(),
    citizenship: toLocalizedEnum(
      faker.helpers.arrayElement<CitizenshipStatus>(
        Object.values(CitizenshipStatus),
      ),
    ),
    armedForcesStatus: toLocalizedEnum(
      faker.helpers.arrayElement<ArmedForcesStatus>(
        Object.values(ArmedForcesStatus),
      ),
    ),

    // Language
    lookingForEnglish: faker.datatype.boolean(),
    lookingForFrench: faker.datatype.boolean(),
    lookingForBilingual: faker.datatype.boolean(),
    comprehensionLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
    ),
    writtenLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
    ),
    verbalLevel: toLocalizedEnum(
      faker.helpers.arrayElement<EvaluatedLanguageAbility>(
        Object.values(EvaluatedLanguageAbility),
      ),
    ),
    estimatedLanguageAbility: toLocalizedEnum(
      faker.helpers.arrayElement<EstimatedLanguageAbility>(
        Object.values(EstimatedLanguageAbility),
      ),
    ),

    // Gov info
    isGovEmployee: faker.datatype.boolean(),
    workEmail: faker.internet.email(),
    govEmployeeType: toLocalizedEnum(
      faker.helpers.arrayElement<GovEmployeeType>(
        Object.values(GovEmployeeType),
      ),
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
      .map((community) => toLocalizedEnum(community)),

    // Applicant info
    hasDiploma: faker.datatype.boolean(),
    locationPreferences: faker.helpers
      .arrayElements<WorkRegion>(Object.values(WorkRegion))
      .map((pref) => toLocalizedEnum(pref)),
    locationExemptions: faker.location.city(),
    acceptedOperationalRequirements: faker.helpers
      .arrayElements<OperationalRequirement>(
        Object.values(OperationalRequirement),
      )
      .map((req) => toLocalizedEnum(req)),
    positionDuration: faker.datatype.boolean()
      ? [PositionDuration.Permanent]
      : [PositionDuration.Permanent, PositionDuration.Temporary],
  };
};

export default defaultGenerator;
