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
  ExperienceSkillPivot,
  Skill,
  LocalizedString,
  // imports required by specific experiences and are linked
  AwardedTo,
  AwardedScope,
  EducationType,
  EducationStatus,
} from "../api/generated";

// lots of X requires Y filling things out and adding connecting Types/Components to one another
// defining the skills here
const sampleApp: Applicant = { email: "blank", id: "blank" };
const theId = "blank";
const theSkillString1: LocalizedString = {
  en: "The first Skill",
  fr: "La première Compétence",
};
const theSkillDescription1: LocalizedString = {
  en: "The first Description",
  fr: "Le premier Descriptif",
};
const theExperienceSkillPivot: ExperienceSkillPivot = {
  details: "The ExperienceSkillPivots details",
};
const sampleSkill1: Skill = {
  id: "blank",
  key: "blank",
  description: theSkillDescription1,
  name: theSkillString1,
  experiencePivot: theExperienceSkillPivot,
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
  experiencePivot: theExperienceSkillPivot,
};

// 5 generators to generate experiences of a certain type
// actual generators start here
const generateAward = (): AwardExperience => {
  faker.setLocale("en");

  return {
    __typename: "AwardExperience",
    applicant: sampleApp,
    id: theId,
    skills: [],
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
    skills: [sampleSkill1],
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
    skills: [sampleSkill1, sampleSkill2],
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
    skills: [sampleSkill1],
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
    skills: [sampleSkill1, sampleSkill2],
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
  generateCommunity: () => {
    faker.seed(0);
    return generateCommunity();
  },
  generateEducation: () => {
    faker.seed(0);
    return generateEducation();
  },
  generatePersonal: () => {
    faker.seed(0);
    return generatePersonal();
  },
  generateWork: () => {
    faker.seed(0);
    return generateWork();
  },
};
