import { faker } from "@faker-js/faker/locale/en";

import toLocalizedString from "./fakeLocalizedString";
import fakeWorkStreams from "./fakeWorkStreams";
import fakeDevelopmentPrograms from "./fakeDevelopmentPrograms";

const generateCommunity = (
  developmentPrograms: ReturnType<typeof fakeDevelopmentPrograms>,
  workStreams: ReturnType<typeof fakeWorkStreams>,
) => {
  return {
    __typename: "Community" as const,
    id: faker.string.uuid(),
    key: faker.helpers.slugify(faker.lorem.word()),
    name: toLocalizedString(faker.company.name()),
    description: toLocalizedString(faker.lorem.paragraph()),
    associatedDevelopmentPrograms:
      faker.helpers.arrayElements(developmentPrograms),
    workStreams: faker.helpers.arrayElements(workStreams),
  };
};

export default (numToGenerate = 10) => {
  faker.seed(0); // repeatable results
  const developmentPrograms = fakeDevelopmentPrograms();
  const workStreams = fakeWorkStreams();
  return Array.from({ length: numToGenerate }, () =>
    generateCommunity(developmentPrograms, workStreams),
  );
};
