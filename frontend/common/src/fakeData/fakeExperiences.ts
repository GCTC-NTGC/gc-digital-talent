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

// for calling this faker from elsewhere, an interface to define what to pass into this
export interface ExperienceChoice {
  experienceChoice: "Award" | "Community" | "Education" | "Personal" | "Work";
}

type AnExperience =
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

// lots of X requires Y filling things out and adding connecting Types/Components to one another
const sampleApp: Applicant = { email: "blank", id: "blank" };
const theId = "blank";
const theString: LocalizedString = {};
const sampleSkill: Skill = { id: "blank", key: "blank", name: theString };
const sampleExperienceInstance: Experience = {
  applicant: sampleApp,
  id: theId,
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
): AnExperience => {
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
): AnExperience => {
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
): AnExperience => {
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
): AnExperience => {
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
): AnExperience => {
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

export default (experienceChoice: string): AnExperience => {
  faker.seed(0);
  if (experienceChoice === "Award") {
    //
    return generateAward(sampleApp, theId, sampleExperience);
  }
  if (experienceChoice === "Community") {
    //
    return generateCommunity(sampleApp, theId, sampleExperience);
  }
  if (experienceChoice === "Education") {
    //
    return generateEducation(sampleApp, theId, sampleExperience);
  }
  if (experienceChoice === "Personal") {
    //
    return generatePersonal(sampleApp, theId, sampleExperience);
  }
  if (experienceChoice === "Work") {
    //
    return generateWork(sampleApp, theId, sampleExperience);
  }

  // otherwise return award if for some reason above didn't work
  return generateAward(sampleApp, theId, sampleExperience);
};
