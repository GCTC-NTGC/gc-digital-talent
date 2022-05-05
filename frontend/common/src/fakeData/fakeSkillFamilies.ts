import { faker } from "@faker-js/faker";
import { SkillCategory, SkillFamily, Skill } from "../api/generated";

const generateSkillFamily = (skills: Skill[]) => {
  const name = faker.random.word();
  return {
    category: faker.helpers.arrayElement<SkillCategory>([
      SkillCategory.Behavioural,
      SkillCategory.Technical,
    ]),
    description: {
      en: `EN ${faker.lorem.sentences()}`,
      fr: `FR ${faker.lorem.sentences()}`,
    },
    id: faker.datatype.uuid(),
    key: faker.helpers.slugify(name),
    name: {
      en: `EN ${name}`,
      fr: `FR ${name}`,
    },
    skills: skills.length
      ? faker.helpers.arrayElements<Skill>(skills)
      : ([] as Skill[]),
  };
};

export default (numToGenerate = 15, skills: Skill[] = []): SkillFamily[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map(() => generateSkillFamily(skills));
};
