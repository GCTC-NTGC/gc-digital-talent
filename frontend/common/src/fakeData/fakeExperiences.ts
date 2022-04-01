import faker from "faker";
import {
  // experiences
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
  // required imports to generate AnExperience to export
  Applicant,
  ExperienceSkill,
  Skill,
  LocalizedString,
  Experience,
  // imports required by specific experiences and are linked
  AwardedTo,
  AwardedScope,
  EducationType,
  EducationStatus,
} from "../api/generated";

// lots of X requires Y filling things out and adding connecting Types/Components to one another
// defining the skills here
const sampleApp: Applicant = { email: "blank", id: "blank" };
const theId = faker.datatype.uuid();
const theSkillString1: LocalizedString = {
  en: "The first Skill",
  fr: "La première Compétence",
};
const theSkillDescription1: LocalizedString = {
  en: "The first Description",
  fr: "Le premier Descriptif",
};
const sampleSkill1: Skill = {
  id: faker.datatype.uuid(),
  key: "blank",
  description: theSkillDescription1,
  name: theSkillString1,
};
const theSkillString2: LocalizedString = {
  en: "The second Skill",
  fr: "La deuxième Compétence",
};
const theSkillDescription2: LocalizedString = {
  en: "The second Description",
  fr: "La deuxième Descriptif",
};
const sampleSkill2: Skill = {
  id: "blank",
  key: "blank",
  description: theSkillDescription2,
  name: theSkillString2,
};
const sampleExperienceInstance: Experience = {
  applicant: sampleApp,
  id: theId,
  // circular dependency here, between sampleExperienceInstance and sampleExperience
  // experienceSkills: [sampleExperience],
};
const sampleExperience1: ExperienceSkill = {
  id: "blank",
  skill: sampleSkill1,
  experience: sampleExperienceInstance,
  details: faker.lorem.sentence(),
};
const sampleExperience2: ExperienceSkill = {
  id: "blank",
  skill: sampleSkill2,
  experience: sampleExperienceInstance,
  details: faker.lorem.sentence(),
};

// 5 generators to generate experiences of a certain type
// actual generators start here
const generateAward = (): AwardExperience => {
  faker.setLocale("en");

  return {
    __typename: "AwardExperience",
    applicant: sampleApp,
    id: theId,
    experienceSkills: [],
    details: faker.random.words(),
    title: faker.lorem.word(),
    awardedTo: faker.random.arrayElement([
      AwardedTo.Me,
      AwardedTo.MyOrganization,
      AwardedTo.MyProject,
      AwardedTo.MyTeam,
    ]),
    awardedScope: faker.random.arrayElement([
      AwardedScope.Community,
      AwardedScope.International,
      AwardedScope.Local,
      AwardedScope.National,
      AwardedScope.Organizational,
      AwardedScope.Provincial,
      AwardedScope.SubOrganizational,
    ]),
    awardedDate: faker.date.past().toString().slice(0, 15),
    issuedBy: faker.company.companyName(),
  };
};

const generateCommunity = (): CommunityExperience => {
  faker.setLocale("en");
  return {
    __typename: "CommunityExperience",
    applicant: sampleApp,
    id: theId,
    experienceSkills: [sampleExperience1],
    details: faker.random.words(),
    title: faker.lorem.word(),
    organization: faker.company.companyName(),
    project: faker.lorem.word(),
    startDate: faker.date.recent().toString().slice(0, 15),
    endDate: faker.date.future().toString().slice(0, 15),
  };
};

const generateEducation = (): EducationExperience => {
  faker.setLocale("en");
  return {
    __typename: "EducationExperience",
    applicant: sampleApp,
    id: theId,
    experienceSkills: [sampleExperience1, sampleExperience2],
    details: faker.random.words(),
    areaOfStudy: faker.music.genre(),
    type: faker.random.arrayElement([
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
    status: faker.random.arrayElement([
      EducationStatus.Audited,
      EducationStatus.DidNotComplete,
      EducationStatus.InProgress,
      EducationStatus.SuccessCredential,
      EducationStatus.SuccessNoCredential,
    ]),
    startDate: faker.date.recent().toString().slice(0, 15),
    endDate: faker.date.future().toString().slice(0, 15),
    thesisTitle: faker.random.words(),
  };
};

const generatePersonal = (): PersonalExperience => {
  faker.setLocale("en");
  return {
    __typename: "PersonalExperience",
    applicant: sampleApp,
    id: theId,
    experienceSkills: [sampleExperience1],
    details: faker.lorem.sentence(),
    title: faker.name.jobTitle(),
    startDate: faker.date.recent().toString().slice(0, 15),
    endDate: faker.date.future().toString().slice(0, 15),
    description: faker.lorem.paragraph(),
  };
};

const generateWork = (): WorkExperience => {
  faker.setLocale("en");
  return {
    __typename: "WorkExperience",
    applicant: sampleApp,
    id: theId,
    experienceSkills: [sampleExperience1, sampleExperience2],
    details: faker.lorem.sentence(),
    organization: faker.company.companyName(),
    role: faker.name.jobTitle(),
    division: faker.animal.bird(),
    startDate: faker.date.past().toString().slice(0, 15),
    endDate: faker.date.soon().toString().slice(0, 15),
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
    const generator = faker.random.arrayElement(generators);
    return generator();
  });

  return experiences;
};

// the 5 single experiences of a specific type
export const generators = {
  generateAward: () => {
    faker.seed(0);
    return generateAward();
  },
  awardExperiences: (numOfExp = 1) => {
    faker.seed(0);
    return [...Array(numOfExp)].map(() => {
      return generateAward();
    });
  },
  generateCommunity: () => {
    faker.seed(0);
    return generateCommunity();
  },
  communityExperiences: (numOfExp = 1) => {
    faker.seed(0);
    if (numOfExp === 1) {
      return generateCommunity();
    }
    return [...Array(numOfExp)].map(() => {
      return generateCommunity();
    });
  },
  generateEducation: () => {
    faker.seed(0);
    return generateEducation();
  },
  educationExperiences: (numOfExp = 1) => {
    faker.seed(0);
    if (numOfExp === 1) {
      return generateEducation();
    }
    return [...Array(numOfExp)].map(() => {
      return generateEducation();
    });
  },
  generatePersonal: () => {
    faker.seed(0);
    return generatePersonal();
  },
  personalExperiences: (numOfExp = 1) => {
    faker.seed(0);
    if (numOfExp === 1) {
      return generatePersonal();
    }
    return [...Array(numOfExp)].map(() => {
      return generatePersonal();
    });
  },
  generateWork: () => {
    faker.seed(0);
    return generateWork();
  },
  workExperiences: (numOfExp = 1) => {
    faker.seed(0);
    if (numOfExp === 1) {
      return generateWork();
    }
    return [...Array(numOfExp)].map(() => {
      return generateWork();
    });
  },
};
