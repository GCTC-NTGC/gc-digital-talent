import { faker } from "@faker-js/faker/locale/en";

import {
  // experiences
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
  // required imports to generate an Experience to export
  User,
  ExperienceSkillRecord,
  Skill,
  // imports required by specific experiences and are linked
  AwardedTo,
  AwardedScope,
  EducationType,
  EducationStatus,
  EmploymentCategory,
  GovContractorType,
  CSuiteRoleTitle,
  GovEmployeeType,
} from "@gc-digital-talent/graphql";

import fakeDepartments from "./fakeDepartments";
import { getStaticSkills } from "./fakeSkills";
import toLocalizedEnum from "./fakeLocalizedEnum";

type WithTypename<T extends { __typename?: string }> = T & {
  __typename: NonNullable<T["__typename"]>;
};

export type GeneratedAwardExperience = WithTypename<AwardExperience>;
export type GeneratedCommunityExperience = WithTypename<CommunityExperience>;
export type GeneratedEducationExperience = WithTypename<EducationExperience>;
export type GeneratedPersonalExperience = WithTypename<PersonalExperience>;
export type GeneratedWorkExperience = WithTypename<WorkExperience>;

export type AnyGeneratedExperience =
  | GeneratedAwardExperience
  | GeneratedCommunityExperience
  | GeneratedEducationExperience
  | GeneratedPersonalExperience
  | GeneratedWorkExperience;

faker.seed(0);

// lots of X requires Y filling things out and adding connecting Types/Components to one another
// defining the skills here
const sampleApp: User = {
  email: faker.internet.email(),
  id: faker.string.uuid(),
};

// skills in detail comes from `skills.experienceSkillRecords.details`
const theExperienceSkillRecord: ExperienceSkillRecord = {
  details: "The skill in detail",
};

const skills = getStaticSkills();

const staticDates = {
  start: "1992-10-24",
  end: "1993-10-23",
};

// 5 generators to generate experiences of a certain type
// actual generators start here
const generateAward = (): GeneratedAwardExperience => {
  return {
    __typename: "AwardExperience",
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.lorem.words()}`,
    title: `experience title ${faker.lorem.word()}`,
    awardedTo: toLocalizedEnum(
      faker.helpers.arrayElement<AwardedTo>(Object.values(AwardedTo)),
    ),
    awardedScope: toLocalizedEnum(
      faker.helpers.arrayElement<AwardedScope>(Object.values(AwardedScope)),
    ),
    awardedDate: staticDates.start,
    issuedBy: faker.company.name(),
    experienceSkillRecord: {
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
  };
};

const generateCommunity = (): GeneratedCommunityExperience => {
  return {
    __typename: "CommunityExperience",
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
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
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
  };
};

const generateEducation = (): GeneratedEducationExperience => {
  return {
    __typename: "EducationExperience",
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.lorem.words()}`,
    areaOfStudy: faker.music.genre(),
    type: toLocalizedEnum(
      faker.helpers.arrayElement<EducationType>(Object.values(EducationType)),
    ),
    institution: faker.person.lastName(),
    status: toLocalizedEnum(
      faker.helpers.arrayElement<EducationStatus>(
        Object.values(EducationStatus),
      ),
    ),
    startDate: staticDates.start,
    endDate: staticDates.end,
    thesisTitle: faker.lorem.words(),
    experienceSkillRecord: {
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
  };
};

const generatePersonal = (): GeneratedPersonalExperience => {
  return {
    __typename: "PersonalExperience",
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.lorem.words()}`,
    title: faker.person.jobTitle(),
    startDate: staticDates.start,
    endDate: staticDates.end,
    description: `experience description ${faker.lorem.paragraph()}`,
    experienceSkillRecord: {
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
  };
};

const generateWork = (): GeneratedWorkExperience => {
  return {
    __typename: "WorkExperience",
    user: sampleApp,
    id: faker.string.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
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
      details: `experience.experienceSkillRecord ${faker.lorem.words()}`,
    },
    department: fakeDepartments()[5],
    employmentCategory: toLocalizedEnum(EmploymentCategory.GovernmentOfCanada),
    govEmploymentType: toLocalizedEnum(GovEmployeeType.Contractor),
    govContractorType: toLocalizedEnum(GovContractorType.SelfEmployed),
    contractorFirmAgencyName: faker.company.name(),
    supervisoryPosition: true,
    supervisedEmployees: true,
    supervisedEmployeesNumber: 50,
    budgetManagement: true,
    annualBudgetAllocation: 100000000,
    seniorManagementStatus: true,
    cSuiteRoleTitle: toLocalizedEnum(CSuiteRoleTitle.Other),
    otherCSuiteRoleTitle: `${faker.person.jobDescriptor()} ${faker.person.jobType()} ${faker.person.jobTitle()} ${faker.person.jobArea()}`,
  };
};

// generate an array of some size filled with random experiences
export default (numberOfExperiences: number) => {
  faker.seed(0);

  const generators = [
    generateAward,
    generateCommunity,
    generateEducation,
    generatePersonal,
    generateWork,
  ];

  // fill an array with random experiences
  const experiences = Array.from({ length: numberOfExperiences }, () => {
    const generator = faker.helpers.arrayElement(generators);
    return generator();
  });

  return experiences;
};

// the 5 single experiences of a specific type
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
