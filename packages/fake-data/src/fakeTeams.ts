import { faker } from "@faker-js/faker/locale/en";

import { Team } from "@gc-digital-talent/graphql";

const generateTeam = (): Team => {
  return {
    id: faker.string.uuid(),
    name: faker.string.sample(),
  };
};

export default (numToGenerate = 10): Team[] => {
  faker.seed(0); // repeatable results
  return Array.from({ length: numToGenerate }, () => generateTeam());
};
