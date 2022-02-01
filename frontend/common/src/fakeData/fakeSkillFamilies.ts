import faker from "faker";
import { SkillCategory, SkillFamily } from "../api/generated";

const generateSkillFamily = () => {
  const name = faker.random.word();
  return {
    category: faker.random.arrayElement([
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
    skills: [], // generating skills here causes recursion
  };
};

export default (numToGenerate = 15): SkillFamily[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map(generateSkillFamily);
};
