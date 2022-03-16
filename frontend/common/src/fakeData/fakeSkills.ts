import faker from "faker";
import {
  Applicant,
  LocalizedString,
  Skill,
  SkillFamily,
  Experience,
  PersonalExperience,
  ExperienceSkill,
} from "../api/generated";
import { generators } from "./fakeExperiences";

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

const sampleSkill1: Skill = {
  id: "blank",
  key: "blank",
  description: theSkillDescription1,
  name: theSkillString1,
};

const personalExperienceSkill: ExperienceSkill = {
  id: "blank",
  skill: sampleSkill1,
  experience: generators.generatePersonal(),
  details: faker.lorem.sentence(),
};

const educationExperienceSkill: ExperienceSkill = {
  id: "blank",
  skill: sampleSkill1,
  experience: generators.generateEducation(),
  details: faker.lorem.sentence(),
};

const communityExperienceSkill: ExperienceSkill = {
  id: "blank",
  skill: sampleSkill1,
  experience: generators.generateCommunity(),
  details: faker.lorem.sentence(),
};

const workExperienceSkill: ExperienceSkill = {
  id: "blank",
  skill: sampleSkill1,
  experience: generators.generateWork(),
  details: faker.lorem.sentence(),
};

const awardExperienceSkill: ExperienceSkill = {
  id: "blank",
  skill: sampleSkill1,
  experience: generators.generateAward(),
  details: faker.lorem.sentence(),
};

const generateSkill = (skillFamilies: SkillFamily[]) => {
  const name = faker.random.word();
  return {
    id: faker.datatype.uuid(),
    key: faker.helpers.slugify(name),
    name: {
      en: `EN ${name}`,
      fr: `FR ${name}`,
    },
    description: {
      en: `EN ${faker.lorem.sentences()}`,
      fr: `FR ${faker.lorem.sentences()}`,
    },
    keywords: faker.lorem.words(3).split(" "),
    families: faker.random.arrayElements(skillFamilies),
    experienceSkills: [
      personalExperienceSkill,
      educationExperienceSkill,
      communityExperienceSkill,
      workExperienceSkill,
      awardExperienceSkill,
    ],
  };
};

export default (
  numToGenerate = 10,
  skillFamilies: SkillFamily[] = [],
): Skill[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map(() => generateSkill(skillFamilies));
};
