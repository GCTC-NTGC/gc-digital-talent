import { faker } from "@faker-js/faker/locale/en";

import toLocalizedString from "./fakeLocalizedString";

const generateDevelopmentProgram = () => {
  return {
    __typename: "DevelopmentProgram" as const,
    id: faker.string.uuid(),
    name: toLocalizedString(faker.company.name()),
    descriptionForProfile: toLocalizedString(faker.lorem.words(15)),
    informationUrl: toLocalizedString(faker.internet.url()),
    abbreviation: toLocalizedString(faker.hacker.abbreviation()),
  };
};

export default (numToGenerate = 10) => {
  faker.seed(0); // repeatable results
  return Array.from({ length: numToGenerate }, () =>
    generateDevelopmentProgram(),
  );
};
