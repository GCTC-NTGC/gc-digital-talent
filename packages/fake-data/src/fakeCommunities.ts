import { faker } from "@faker-js/faker/locale/en";

import {
  Community,
  DevelopmentProgram,
  WorkStream,
} from "@gc-digital-talent/graphql";

import toLocalizedString from "./fakeLocalizedString";
import fakeWorkStreams from "./fakeWorkStreams";
import fakeDevelopmentPrograms from "./fakeDevelopmentPrograms";

const generateCommunity = (
  developmentPrograms: DevelopmentProgram[],
  workStreams: WorkStream[],
): Community => {
  return {
    id: faker.string.uuid(),
    key: faker.helpers.slugify(faker.lorem.word()),
    name: toLocalizedString(faker.company.name()),
    description: toLocalizedString(faker.lorem.paragraph()),
    developmentPrograms:
      faker.helpers.arrayElements<DevelopmentProgram>(developmentPrograms),
    workStreams: faker.helpers.arrayElements<WorkStream>(workStreams),
  };
};

export default (numToGenerate = 10): Community[] => {
  faker.seed(0); // repeatable results
  const developmentPrograms = fakeDevelopmentPrograms();
  const workStreams = fakeWorkStreams();
  return Array.from({ length: numToGenerate }, () =>
    generateCommunity(developmentPrograms, workStreams),
  );
};
