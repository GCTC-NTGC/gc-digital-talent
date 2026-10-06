import { faker } from "@faker-js/faker/locale/en";

import {
  AwardedTo,
  AwardedScope,
  EducationType,
  EducationStatus,
  EmploymentCategory,
  GovContractorType,
  CSuiteRoleTitle,
  GovEmployeeType,
  DegreeType,
  FellowshipType,
} from "@gc-digital-talent/graphql/schema-types";

import fakeDepartments from "./fakeDepartments";
import { getStaticSkills } from "./fakeSkills";
import toLocalizedEnum from "./fakeLocalizedEnum";

faker.seed(0);

const sampleApp = {
  __typename: "User" as const,
  email: faker.internet.email(),
  id: faker.string.uuid(),
};

const theExperienceSkillRecord = {
  __typename: "ExperienceSkillRecord" as const,
  details: "The skill in detail",
};

const skills = getStaticSkills();

const staticDates = {
  start: "1992-10-24",
  end: "1993-10-23",
};

const generateAward = () => {
  return {
    __typename: "AwardExperience" as const,
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.lorem.words()}`,
    title: `experience title ${faker.lorem.word()}`,
    awardedTo: toLocalizedEnum(
      faker.helpers.arrayElement<AwardedTo>(Object.values(AwardedTo)),
      "LocalizedAwardedTo",
    ),
    awardedScope: toLocalizedEnum(
      faker.helpers.arrayElement<AwardedScope>(Object.values(AwardedScope)),
      "LocalizedAwardedScope",
    ),
    awardedDate: staticDates.start,
    issuedBy: faker.company.name(),
    projectName: null,
    relatedExperience: null,
    experienceSkillRecord: {
      __typename: "ExperienceSkillRecord" as const,
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
  };
};

const generateCommunity = () => {
  return {
    __typename: "CommunityExperience" as const,
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.lorem.words()}`,
    title: `experience title ${faker.lorem.word()}`,
    organization: faker.company.name(),
    project: faker.lorem.word(),
    startDate: staticDates.start,
    endDate: staticDates.end,
    experienceSkillRecord: {
      __typename: "ExperienceSkillRecord" as const,
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
  };
};

const generateEducation = () => {
  return {
    __typename: "EducationExperience" as const,
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.lorem.words()}`,
    areaOfStudy: faker.music.genre(),
    educationType: toLocalizedEnum(
      faker.helpers.arrayElement<EducationType>(Object.values(EducationType)),
      "LocalizedEducationType",
    ),
    institution: faker.person.lastName(),
    status: toLocalizedEnum(
      faker.helpers.arrayElement<EducationStatus>(
        Object.values(EducationStatus),
      ),
      "LocalizedEducationStatus",
    ),
    startDate: staticDates.start,
    endDate: staticDates.end,
    prospectiveEndDate: null,
    otherEducationType: null,
    otherFellowshipType: null,
    thesisTitle: faker.lorem.words(),
    experienceSkillRecord: {
      __typename: "ExperienceSkillRecord" as const,
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
    degreeType: toLocalizedEnum(
      faker.helpers.arrayElement<DegreeType>(Object.values(DegreeType)),
      "LocalizedDegreeType",
    ),
    certification: faker.lorem.words(),
    courseName: faker.lorem.words(),
    licenseOrAccreditation: faker.lorem.words(),
    fellowshipType: toLocalizedEnum(
      faker.helpers.arrayElement<FellowshipType>(Object.values(FellowshipType)),
      "LocalizedFellowshipType",
    ),
  };
};

const generatePersonal = () => {
  return {
    __typename: "PersonalExperience" as const,
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    title: faker.person.jobTitle(),
    startDate: staticDates.start,
    endDate: staticDates.end,
    experienceSkillRecord: {
      __typename: "ExperienceSkillRecord" as const,
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
    learningDescription: faker.lorem.paragraph(),
    organization: faker.company.buzzPhrase(),
  };
};

const generateWork = () => {
  return {
    __typename: "WorkExperience" as const,
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.lorem.words()}`,
    organization: faker.company.name(),
    role: `${faker.person.jobDescriptor()} ${faker.person.jobType()} ${faker.person.jobTitle()} ${faker.person.jobArea()}`,
    division: faker.animal.bird(),
    startDate: staticDates.start,
    endDate: staticDates.end,
    experienceSkillRecord: {
      __typename: "ExperienceSkillRecord" as const,
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
    department: fakeDepartments(true)[5],
    classification: null,
    workStreams: [],
    employmentCategory: toLocalizedEnum(
      EmploymentCategory.GovernmentOfCanada,
      "LocalizedEmploymentCategory",
    ),
    extSizeOfOrganization: null,
    extRoleSeniority: null,
    govEmploymentType: toLocalizedEnum(
      GovEmployeeType.Contractor,
      "LocalizedGovEmployeeType",
    ),
    govPositionType: null,
    govContractorRoleSeniority: null,
    govContractorType: toLocalizedEnum(
      GovContractorType.SelfEmployed,
      "LocalizedGovContractorType",
    ),
    cafEmploymentType: null,
    cafForce: null,
    cafRank: null,
    contractorFirmAgencyName: faker.company.name(),
    supervisoryPosition: true,
    supervisedEmployees: true,
    supervisedEmployeesNumber: 50,
    budgetManagement: true,
    annualBudgetAllocation: 100000000,
    seniorManagementStatus: true,
    cSuiteRoleTitle: toLocalizedEnum(
      CSuiteRoleTitle.Other,
      "LocalizedCSuiteRoleTitle",
    ),
    otherCSuiteRoleTitle: `${faker.person.jobDescriptor()} ${faker.person.jobType()} ${faker.person.jobTitle()} ${faker.person.jobArea()}`,
  };
};

export type GeneratedAwardExperience = ReturnType<typeof generateAward>;
export type GeneratedCommunityExperience = ReturnType<typeof generateCommunity>;
export type GeneratedEducationExperience = ReturnType<typeof generateEducation>;
export type GeneratedPersonalExperience = ReturnType<typeof generatePersonal>;
export type GeneratedWorkExperience = ReturnType<typeof generateWork>;

export type AnyGeneratedExperience =
  | GeneratedAwardExperience
  | GeneratedCommunityExperience
  | GeneratedEducationExperience
  | GeneratedPersonalExperience
  | GeneratedWorkExperience;

export default (numberOfExperiences: number) => {
  faker.seed(0);

  const generators = [
    generateAward,
    generateCommunity,
    generateEducation,
    generatePersonal,
    generateWork,
  ];

  const experiences = Array.from({ length: numberOfExperiences }, () => {
    const generator = faker.helpers.arrayElement(generators);
    return generator();
  });

  return experiences;
};

export const experienceGenerators = {
  awardExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return Array.from({ length: numOfExp }, () => {
      return generateAward();
    });
  },
  communityExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return Array.from({ length: numOfExp }, () => {
      return generateCommunity();
    });
  },
  educationExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return Array.from({ length: numOfExp }, () => {
      return generateEducation();
    });
  },
  personalExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return Array.from({ length: numOfExp }, () => {
      return generatePersonal();
    });
  },
  workExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return Array.from({ length: numOfExp }, () => {
      return generateWork();
    });
  },
};
