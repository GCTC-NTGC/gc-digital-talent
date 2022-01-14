import faker from "faker";
import { SkillCategory, SkillFamily, Skill } from "../api/generated";

const generateSkillFamily = (name: string) => {
  return {
    category: faker.random.arrayElement([
      SkillCategory.Behavioural,
      SkillCategory.Technical,
    ]),
    description: {
      en: faker.lorem.sentences(),
      fr: faker.lorem.sentences(),
    },
    id: faker.datatype.uuid(),
    key: name,
    name: {
      en: name,
      fr: name,
    },
    skills: new Array<Skill>(faker.datatype.number(20)),
  };
};

export default (): SkillFamily[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(15)].map(() =>
    generateSkillFamily(faker.unique(faker.random.word)),
  );
};
