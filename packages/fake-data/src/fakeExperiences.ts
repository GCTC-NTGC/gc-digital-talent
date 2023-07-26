import { faker } from "@faker-js/faker";

import {
  // experiences
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
  // required imports to generate AnExperience to export
  User,
  ExperienceSkillRecord,
  Skill,
  // imports required by specific experiences and are linked
  AwardedTo,
  AwardedScope,
  EducationType,
  EducationStatus,
} from "@gc-digital-talent/graphql";
import { getStaticSkills } from "./fakeSkills";

type WithTypename<T extends { __typename?: string }> = T & {
  __typename: NonNullable<T["__typename"]>;
};

export type GeneratedAwardExperience = WithTypename<AwardExperience>;
export type GeneratedCommunityExperience = WithTypename<CommunityExperience>;
export type GeneratedEducationExperience = WithTypename<EducationExperience>;
export type GeneratedPersonalExperience = WithTypename<PersonalExperience>;
export type GeneratedWorkExperience = WithTypename<WorkExperience>;

// lots of X requires Y filling things out and adding connecting Types/Components to one another
// defining the skills here
const sampleApp: User = {
  email: faker.internet.email(),
  id: faker.datatype.uuid(),
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
  faker.setLocale("en");

  return {
    __typename: "AwardExperience",
    user: sampleApp,
    id: faker.datatype.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.random.words()}`,
    title: `experience title ${faker.lorem.word()}`,
    awardedTo: faker.helpers.arrayElement<AwardedTo>([
      AwardedTo.Me,
      AwardedTo.MyOrganization,
      AwardedTo.MyProject,
      AwardedTo.MyTeam,
    ]),
    awardedScope: faker.helpers.arrayElement<AwardedScope>([
      AwardedScope.Community,
      AwardedScope.International,
      AwardedScope.Local,
      AwardedScope.National,
      AwardedScope.Organizational,
      AwardedScope.Provincial,
      AwardedScope.SubOrganizational,
    ]),
    awardedDate: staticDates.start,
    issuedBy: faker.company.name(),
    experienceSkillRecord: {
      details: `experience.experienceSkillRecord ${faker.random.words()}`,
    },
  };
};

const generateCommunity = (): GeneratedCommunityExperience => {
  faker.setLocale("en");
  return {
    __typename: "CommunityExperience",
    user: sampleApp,
    id: faker.datatype.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.random.words()}`,
    title: `experience title ${faker.lorem.word()}`,
    organization: faker.company.name(),
    project: faker.lorem.word(),
    startDate: staticDates.start,
    endDate: staticDates.end,
    experienceSkillRecord: {
      details: `experience.experienceSkillRecord ${faker.random.words()}`,
    },
  };
};

const generateEducation = (): GeneratedEducationExperience => {
  faker.setLocale("en");
  return {
    __typename: "EducationExperience",
    user: sampleApp,
    id: faker.datatype.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.random.words()}`,
    areaOfStudy: faker.music.genre(),
    type: faker.helpers.arrayElement<EducationType>([
      EducationType.BachelorsDegree,
      EducationType.Certification,
      EducationType.Diploma,
      EducationType.MastersDegree,
      EducationType.OnlineCourse,
      EducationType.Other,
      EducationType.Phd,
      EducationType.PostDoctoralFellowship,
    ]),
    institution: faker.name.lastName(),
    status: faker.helpers.arrayElement<EducationStatus>([
      EducationStatus.Audited,
      EducationStatus.DidNotComplete,
      EducationStatus.InProgress,
      EducationStatus.SuccessCredential,
      EducationStatus.SuccessNoCredential,
    ]),
    startDate: staticDates.start,
    endDate: staticDates.end,
    thesisTitle: faker.random.words(),
    experienceSkillRecord: {
      details: `experience.experienceSkillRecord ${faker.random.words()}`,
    },
  };
};

const generatePersonal = (): GeneratedPersonalExperience => {
  faker.setLocale("en");
  return {
    __typename: "PersonalExperience",
    user: sampleApp,
    id: faker.datatype.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.random.words()}`,
    title: faker.name.jobTitle(),
    startDate: staticDates.start,
    endDate: staticDates.end,
    description: `experience description ${faker.lorem.paragraph()}`,
    experienceSkillRecord: {
      details: `experience.experienceSkillRecord ${faker.random.words()}`,
    },
  };
};

const generateWork = (): GeneratedWorkExperience => {
  faker.setLocale("en");
  return {
    __typename: "WorkExperience",
    user: sampleApp,
    id: faker.datatype.uuid(),
    skills: faker.helpers.arrayElements<Skill>(skills, 3).map((skill) => ({
      ...skill,
      experienceSkillRecord: theExperienceSkillRecord,
    })),
    details: `experience details ${faker.random.words()}`,
    organization: faker.company.name(),
    role: faker.name.jobTitle(),
    division: faker.animal.bird(),
    startDate: staticDates.start,
    endDate: staticDates.end,
    experienceSkillRecord: {
      details: `experience.experienceSkillRecord ${faker.random.words()}`,
    },
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
  const experiences = [...Array(numberOfExperiences)].map(() => {
    const generator = faker.helpers.arrayElement(generators);
    return generator();
  });

  return experiences;
};

// the 5 single experiences of a specific type
export const experienceGenerators = {
  awardExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return [...Array(numOfExp)].map(() => {
      return generateAward();
    });
  },
  communityExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return [...Array(numOfExp)].map(() => {
      return generateCommunity();
    });
  },
  educationExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return [...Array(numOfExp)].map(() => {
      return generateEducation();
    });
  },
  personalExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return [...Array(numOfExp)].map(() => {
      return generatePersonal();
    });
  },
  workExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return [...Array(numOfExp)].map(() => {
      return generateWork();
    });
  },
};
