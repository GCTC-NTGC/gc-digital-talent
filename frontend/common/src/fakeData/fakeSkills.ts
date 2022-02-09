import faker from "faker";
import { Skill, SkillFamily } from "../api/generated";

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
