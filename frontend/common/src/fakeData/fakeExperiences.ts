import faker from "faker";
import {
  // experiences
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
  // required imports to generate
  Applicant,
  ExperienceSkill,
  Skill,
  LocalizedString,
  Experience,
  // imports required by specific experiences and are linked
  AwardedTo,
  AwardedScope,
  EducationType,
} from "../api/generated";

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

// generate the actual experience object to export
const generateExperience = (
  theApplicant: Applicant,
  id: string,
  sampleExperienceSample: ExperienceSkill,
): AnExperience => {
  faker.setLocale("en");
  return {
    __typename: faker.random.arrayElement([
      "AwardExperience",
      "CommunityExperience",
      "EducationExperience",
      "PersonalExperience",
      "WorkExperience",
    ]),
    applicant: theApplicant,
    id,
    experienceSkills: [sampleExperienceSample],
    institution: faker.name.lastName(),
    issuedBy: faker.name.firstName(),
    organization: faker.company.companyName(),
    description: faker.random.words(),
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
    division: faker.random.word(),
  };
};

export default (): AnExperience => {
  return generateExperience(sampleApp, theId, sampleExperience);
};
