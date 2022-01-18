import faker from "faker";
import fakeSkills from "./fakeSkills";
import { SkillCategory, SkillFamily } from "../api/generated";

const generateSkillFamily = (name: string) => {
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
    key: name,
    name: {
      en: `EN ${name}`,
      fr: `FR ${name}`,
    },
    skills: fakeSkills(faker.datatype.number(20)),
  };
};

export default (): SkillFamily[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(15)].map(() =>
    generateSkillFamily(faker.unique(faker.random.word)),
  );
};
