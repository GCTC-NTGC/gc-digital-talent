import faker from "faker";
import { Skill, ExperienceSkill, Experience } from "../api/generated";

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
