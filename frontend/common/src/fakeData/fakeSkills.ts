import faker from "faker";
import { Skill } from "../api/generated";

const generateSkill = () => {
  const name = faker.unique(faker.random.word);
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
    families: [], // generating families here causes recursion
  };
};

export default (numToGenerate = 10): Skill[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map(generateSkill);
};
