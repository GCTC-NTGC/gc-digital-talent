import { faker } from "@faker-js/faker/locale/en";

import { DevelopmentProgram } from "@gc-digital-talent/graphql";

import toLocalizedString from "./fakeLocalizedString";

const generateDevelopmentProgram = (): DevelopmentProgram => {
  return {
    id: faker.string.uuid(),
    name: toLocalizedString(faker.company.name()),
  };
};

export default (numToGenerate = 10): DevelopmentProgram[] => {
  faker.seed(0); // repeatable results
  return Array.from({ length: numToGenerate }, () =>
    generateDevelopmentProgram(),
  );
};
