import { faker } from "@faker-js/faker";
import {
  User,
  Language,
  ProvinceOrTerritory,
  LanguageAbility,
  BilingualEvaluation,
  EvaluatedLanguageAbility,
  EstimatedLanguageAbility,
  Classification,
  OperationalRequirement,
  JobLookingStatus,
  Pool,
  PoolCandidate,
  WorkRegion,
  SalaryRange,
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
  GovEmployeeType,
  Applicant,
  Department,
  CitizenshipStatus,
  ArmedForcesStatus,
  GenericJobTitle,
  PositionDuration,
} from "../api/generated";
import fakeClassifications from "./fakeClassifications";
import fakeDepartments from "./fakeDepartments";
import fakeGenericJobTitles from "./fakeGenericJobTitles";

const generateUser = (
  departments: Department[],
  classifications: Classification[], // all classifications
  genericJobTitles: GenericJobTitle[], // all generic job titles

  awardExperiences: AwardExperience[], // Experiences belonging to this user
  communityExperiences: CommunityExperience[], // Experiences belonging to this user
  educationExperiences: EducationExperience[], // Experiences belonging to this user
  personalExperiences: PersonalExperience[], // Experiences belonging to this user
  workExperiences: WorkExperience[], // Experiences belonging to this user

  poolCandidates: PoolCandidate[] = [], // poolCandidates associating this user with a pool
  pools: Pool[] = [], // pools owned by this user
): User => {
  faker.setLocale("en");

  return {
    __typename: "User",
    id: faker.datatype.uuid(),

    // Personal Info
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
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
    currentCity: faker.address.city(),
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
    languageAbility: faker.helpers.arrayElement<LanguageAbility>(
      Object.values(LanguageAbility),
    ),
    lookingForEnglish: faker.datatype.boolean(),
    lookingForFrench: faker.datatype.boolean(),
    lookingForBilingual: faker.datatype.boolean(),
    bilingualEvaluation: faker.helpers.arrayElement<BilingualEvaluation>(
      Object.values(BilingualEvaluation),
    ),
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
    isIndigenous: faker.datatype.boolean(),
    isVisibleMinority: faker.datatype.boolean(),

    // Applicant info
    jobLookingStatus: faker.helpers.arrayElement<JobLookingStatus>(
      Object.values(JobLookingStatus),
    ),
    hasDiploma: faker.datatype.boolean(),
    locationPreferences: faker.helpers.arrayElements<WorkRegion>(
      Object.values(WorkRegion),
    ),
    locationExemptions: faker.address.city(),
    acceptedOperationalRequirements:
      faker.helpers.arrayElements<OperationalRequirement>(
        Object.values(OperationalRequirement),
      ),
    expectedSalary: faker.helpers.arrayElements<SalaryRange>(
      Object.values(SalaryRange),
    ),
    expectedClassifications:
      faker.helpers.arrayElements<Classification>(classifications),
    positionDuration: faker.datatype.boolean()
      ? [PositionDuration.Permanent]
      : [PositionDuration.Permanent, PositionDuration.Temporary],
    expectedGenericJobTitles:
      faker.helpers.arrayElements<GenericJobTitle>(genericJobTitles),
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

    pools,
  };
};

// Default generator will not include any experiences, poolCandidates or pools
export const defaultGenerator = (numToGenerate = 20): User[] => {
  const departments = fakeDepartments();
  const classifications = fakeClassifications();
  const genericJobTitles = fakeGenericJobTitles();

  const awardExperiences: AwardExperience[] = [];
  const communityExperiences: CommunityExperience[] = [];
  const educationExperiences: EducationExperience[] = [];
  const personalExperiences: PersonalExperience[] = [];
  const workExperiences: WorkExperience[] = [];

  faker.seed(0); // repeatable results
  return [...Array(numToGenerate)].map(() =>
    generateUser(
      departments,
      classifications,
      genericJobTitles,
      awardExperiences,
      communityExperiences,
      educationExperiences,
      personalExperiences,
      workExperiences,
    ),
  );
};

export const applicantGenerator = (numToGenerate = 20): Applicant[] => {
  return defaultGenerator(numToGenerate).map((user) => {
    return {
      ...user,
      __typename: "Applicant",
    };
  });
};

export default defaultGenerator;
