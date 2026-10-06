import { faker } from "@faker-js/faker/locale/en";

import type { Team } from "@gc-digital-talent/graphql/schema-types";

const generateTeam = (): Team => {
  return {
    __typename: "Team",
    id: faker.string.uuid(),
    name: faker.string.sample(),
  };
};

export default (numToGenerate = 10): Team[] => {
  faker.seed(0); // repeatable results
  return Array.from({ length: numToGenerate }, () => generateTeam());
};
