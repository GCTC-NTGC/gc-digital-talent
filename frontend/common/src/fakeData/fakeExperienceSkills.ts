import { faker } from "@faker-js/faker";
import { Skill, Experience } from "../api/generated";

interface ExperienceSkill {
  id: string;
  skill: Skill;
  experience: Experience;
  details: string;
}

const generateExperienceSkill = (
  skill: Skill,
  experience: Experience,
): ExperienceSkill => {
  faker.setLocale("en");
  return {
    id: faker.datatype.uuid(),
    skill,
    experience,
    details: faker.lorem.sentence(),
  };
};

const generator = {
  generateExperienceSkill: (skill: Skill, experience: Experience) => {
    faker.seed(0);
    return generateExperienceSkill(skill, experience);
  },
};

export default generator;
