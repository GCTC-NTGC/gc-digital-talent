import faker from "faker";
import { Skill } from "../api/generated";

const generateSkill = (): Skill => {
  faker.setLocale("en");

  return {
    id: faker.datatype.uuid(),
    key: faker.datatype.string(),
    name: {
      en: `EN ${faker.lorem.word()}`,
      fr: `FR ${faker.lorem.word()}`,
    },
    description: {
      en: `EN ${faker.lorem.paragraph()}`,
      fr: `FR ${faker.lorem.paragraph()}`,
    },
    families: [],
    keywords: [],
  };
};

export default (): Skill[] => {
  faker.seed(0); // repeatable results
  return [...Array(10)].map(() => generateSkill());
};
