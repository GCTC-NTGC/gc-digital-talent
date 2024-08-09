import { faker } from "@faker-js/faker/locale/en";

import { Community } from "@gc-digital-talent/graphql";

import toLocalizedString from "./fakeLocalizedString";

const generateCommunity = (): Community => {
  return {
    id: faker.string.uuid(),
    key: faker.helpers.slugify(faker.lorem.word()),
    name: toLocalizedString(faker.company.name()),
    description: toLocalizedString(faker.lorem.paragraph()),
  };
};

export default (numToGenerate = 10): Community[] => {
  faker.seed(0); // repeatable results
  return [...Array(numToGenerate)].map(() => generateCommunity());
};
