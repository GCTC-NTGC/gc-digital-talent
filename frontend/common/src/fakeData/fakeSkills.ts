import faker from "faker";
import { Skill } from "../api/generated";

const generateSkill = (name: string) => {
  return {
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
  };
};

export default (numToGenerate = 10): Skill[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map(() =>
    generateSkill(faker.random.word()),
  );
};
