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
const sampleApp: Applicant = { email: "blank", id: "blank" };
const theId = "blank";
const theString: LocalizedString = { en: "The Skill" };
const theDescription: LocalizedString = { en: "The Description" };
const sampleSkill: Skill = {
  id: "blank",
  key: "blank",
  description: theDescription,
  name: theString,
};
const sampleExperienceInstance: Experience = {
  applicant: sampleApp,
  id: theId,
  // circular dependency here, between sampleExperienceInstance and sampleExperience
  // experienceSkills: [sampleExperience],
};
const sampleExperience: ExperienceSkill = {
  id: "blank",
  skill: sampleSkill,
  experience: sampleExperienceInstance,
};

// 5 generators to generate experiences of a certain type
// actual generators start here
const generateAward = (
  theApplicant: Applicant,
  id: string,
  sampleExperienceSample: ExperienceSkill,
): AwardExperience => {
  faker.setLocale("en");
  return {
    __typename: "AwardExperience",
    applicant: theApplicant,
    id,
    experienceSkills: [sampleExperienceSample],
    details: faker.random.words(),
    title: faker.random.word(),
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
    issuedBy: faker.name.firstName(),
  };
};

const generateCommunity = (
  theApplicant: Applicant,
  id: string,
  sampleExperienceSample: ExperienceSkill,
): CommunityExperience => {
  faker.setLocale("en");
  return {
    __typename: "CommunityExperience",
    applicant: theApplicant,
    id,
    experienceSkills: [sampleExperienceSample],
    details: faker.random.words(),
    title: faker.random.word(),
    organization: faker.company.companyName(),
    project: faker.lorem.word(),
    startDate: faker.date.recent().toString().slice(0, 15),
    endDate: faker.date.future().toString().slice(0, 15),
  };
};

const generateEducation = (
  theApplicant: Applicant,
  id: string,
  sampleExperienceSample: ExperienceSkill,
): EducationExperience => {
  faker.setLocale("en");
  return {
    __typename: "EducationExperience",
    applicant: theApplicant,
    id,
    experienceSkills: [sampleExperienceSample],
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
  };
};

const generatePersonal = (
  theApplicant: Applicant,
  id: string,
  sampleExperienceSample: ExperienceSkill,
): PersonalExperience => {
  faker.setLocale("en");
  return {
    __typename: "PersonalExperience",
    applicant: theApplicant,
    id,
    experienceSkills: [sampleExperienceSample],
    details: faker.random.words(),
    title: faker.random.word(),
    startDate: faker.date.recent().toString().slice(0, 15),
    endDate: faker.date.future().toString().slice(0, 15),
    description: faker.lorem.paragraph(),
  };
};

const generateWork = (
  theApplicant: Applicant,
  id: string,
  sampleExperienceSample: ExperienceSkill,
): WorkExperience => {
  faker.setLocale("en");
  return {
    __typename: "WorkExperience",
    applicant: theApplicant,
    id,
    experienceSkills: [sampleExperienceSample],
    details: faker.random.words(),
    organization: faker.company.companyName(),
    role: faker.name.jobTitle(),
    startDate: faker.date.past().toString().slice(0, 15),
    endDate: faker.date.soon().toString().slice(0, 15),
  };
};

// generate an array of some size filled with random experiences
export default (numberOfExperiences: number) => {
  faker.seed(0);

  const generators = [
    () => generateAward(sampleApp, theId, sampleExperience),
    () => generateCommunity(sampleApp, theId, sampleExperience),
    () => generateEducation(sampleApp, theId, sampleExperience),
    () => generatePersonal(sampleApp, theId, sampleExperience),
    () => generateWork(sampleApp, theId, sampleExperience),
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
  generateAward,
  generateCommunity,
  generateEducation,
  generatePersonal,
  generateWork,
};
