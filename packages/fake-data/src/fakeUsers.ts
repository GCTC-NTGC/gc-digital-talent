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
  poolCandidates?: Maybe<Array<Maybe<GeneratedPoolCandidate>>>;
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
): GeneratedUser => {
  return {
    __typename: "User",
    id: faker.string.uuid(),

    // Personal Info
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    telephone: faker.helpers.replaceSymbols("+###########"),
    preferredLang: faker.helpers.arrayElement<Language>(
      Object.values(Language),
    ),
    preferredLanguageForInterview: faker.helpers.arrayElement<Language>(
      Object.values(Language),
    ),
    preferredLanguageForExam: faker.helpers.arrayElement<Language>(
      Object.values(Language),
    ),
    currentProvince: faker.helpers.arrayElement<ProvinceOrTerritory>(
      Object.values(ProvinceOrTerritory),
    ),
    currentCity: faker.location.city(),
    citizenship: faker.helpers.arrayElement<CitizenshipStatus>([
      CitizenshipStatus.Citizen,
      CitizenshipStatus.PermanentResident,
      CitizenshipStatus.Other,
    ]),
    armedForcesStatus: faker.helpers.arrayElement<ArmedForcesStatus>([
      ArmedForcesStatus.Veteran,
      ArmedForcesStatus.Member,
      ArmedForcesStatus.NonCaf,
    ]),

    // Language
    lookingForEnglish: faker.datatype.boolean(),
    lookingForFrench: faker.datatype.boolean(),
    lookingForBilingual: faker.datatype.boolean(),
    comprehensionLevel: faker.helpers.arrayElement<EvaluatedLanguageAbility>(
      Object.values(EvaluatedLanguageAbility),
    ),
    writtenLevel: faker.helpers.arrayElement<EvaluatedLanguageAbility>(
      Object.values(EvaluatedLanguageAbility),
    ),
    verbalLevel: faker.helpers.arrayElement<EvaluatedLanguageAbility>(
      Object.values(EvaluatedLanguageAbility),
    ),
    estimatedLanguageAbility:
      faker.helpers.arrayElement<EstimatedLanguageAbility>(
        Object.values(EstimatedLanguageAbility),
      ),

    // Gov info
    isGovEmployee: faker.datatype.boolean(),
    govEmployeeType: faker.helpers.arrayElement<GovEmployeeType>([
      GovEmployeeType.Student,
      GovEmployeeType.Casual,
      GovEmployeeType.Term,
      GovEmployeeType.Indeterminate,
    ]),
    department: faker.helpers.arrayElement<Department>(departments),
    currentClassification:
      faker.helpers.arrayElement<Classification>(classifications),
    hasPriorityEntitlement: faker.datatype.boolean(),

    // Employment Equity
    isWoman: faker.datatype.boolean(),
    hasDisability: faker.datatype.boolean(),
    isVisibleMinority: faker.datatype.boolean(),
    indigenousCommunities: faker.helpers.arrayElements<IndigenousCommunity>([
      IndigenousCommunity.StatusFirstNations,
      IndigenousCommunity.NonStatusFirstNations,
      IndigenousCommunity.Inuit,
      IndigenousCommunity.Metis,
      IndigenousCommunity.Other,
      IndigenousCommunity.LegacyIsIndigenous,
    ]),

    // Applicant info
    hasDiploma: faker.datatype.boolean(),
    locationPreferences: faker.helpers.arrayElements<WorkRegion>(
      Object.values(WorkRegion),
    ),
    locationExemptions: faker.location.city(),
    acceptedOperationalRequirements:
      faker.helpers.arrayElements<OperationalRequirement>(
        Object.values(OperationalRequirement),
      ),
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

  faker.seed(0); // repeatable results
  return [...Array(numToGenerate)].map(() =>
    generateUser(
      departments,
      classifications,
      awardExperiences,
      communityExperiences,
      educationExperiences,
      personalExperiences,
      workExperiences,
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
    preferredLang: faker.helpers.arrayElement<Language>(
      Object.values(Language),
    ),
    preferredLanguageForInterview: faker.helpers.arrayElement<Language>(
      Object.values(Language),
    ),
    preferredLanguageForExam: faker.helpers.arrayElement<Language>(
      Object.values(Language),
    ),
    currentProvince: faker.helpers.arrayElement<ProvinceOrTerritory>(
      Object.values(ProvinceOrTerritory),
    ),
    currentCity: faker.location.city(),
    citizenship: faker.helpers.arrayElement<CitizenshipStatus>([
      CitizenshipStatus.Citizen,
      CitizenshipStatus.PermanentResident,
      CitizenshipStatus.Other,
    ]),
    armedForcesStatus: faker.helpers.arrayElement<ArmedForcesStatus>([
      ArmedForcesStatus.Veteran,
      ArmedForcesStatus.Member,
      ArmedForcesStatus.NonCaf,
    ]),

    // Language
    lookingForEnglish: faker.datatype.boolean(),
    lookingForFrench: faker.datatype.boolean(),
    lookingForBilingual: faker.datatype.boolean(),
    comprehensionLevel: faker.helpers.arrayElement<EvaluatedLanguageAbility>(
      Object.values(EvaluatedLanguageAbility),
    ),
    writtenLevel: faker.helpers.arrayElement<EvaluatedLanguageAbility>(
      Object.values(EvaluatedLanguageAbility),
    ),
    verbalLevel: faker.helpers.arrayElement<EvaluatedLanguageAbility>(
      Object.values(EvaluatedLanguageAbility),
    ),
    estimatedLanguageAbility:
      faker.helpers.arrayElement<EstimatedLanguageAbility>(
        Object.values(EstimatedLanguageAbility),
      ),

    // Gov info
    isGovEmployee: faker.datatype.boolean(),
    govEmployeeType: faker.helpers.arrayElement<GovEmployeeType>([
      GovEmployeeType.Student,
      GovEmployeeType.Casual,
      GovEmployeeType.Term,
      GovEmployeeType.Indeterminate,
    ]),
    department: faker.helpers.arrayElement<Department>(departments),
    currentClassification:
      faker.helpers.arrayElement<Classification>(classifications),
    hasPriorityEntitlement: faker.datatype.boolean(),

    // Employment Equity
    isWoman: faker.datatype.boolean(),
    hasDisability: faker.datatype.boolean(),
    isVisibleMinority: faker.datatype.boolean(),
    indigenousCommunities: faker.helpers.arrayElements<IndigenousCommunity>([
      IndigenousCommunity.StatusFirstNations,
      IndigenousCommunity.NonStatusFirstNations,
      IndigenousCommunity.Inuit,
      IndigenousCommunity.Metis,
      IndigenousCommunity.Other,
      IndigenousCommunity.LegacyIsIndigenous,
    ]),

    // Applicant info
    hasDiploma: faker.datatype.boolean(),
    locationPreferences: faker.helpers.arrayElements<WorkRegion>(
      Object.values(WorkRegion),
    ),
    locationExemptions: faker.location.city(),
    acceptedOperationalRequirements:
      faker.helpers.arrayElements<OperationalRequirement>(
        Object.values(OperationalRequirement),
      ),
    positionDuration: faker.datatype.boolean()
      ? [PositionDuration.Permanent]
      : [PositionDuration.Permanent, PositionDuration.Temporary],
  };
};

export default defaultGenerator;
