import { faker } from "@faker-js/faker/locale/en";

import toLocalizedString from "./fakeLocalizedString";

const generateWorkStream = () => {
  return {
    __typename: "WorkStream" as const,
    id: faker.string.uuid(),
    key: faker.helpers.slugify(faker.string.sample()),
    name: toLocalizedString(faker.company.catchPhrase()),
    plainLanguageName: toLocalizedString(faker.company.catchPhrase()),
    talentSearchable: faker.datatype.boolean(),
  };
};

export default (numToGenerate = 10) => {
  faker.seed(0); // repeatable results

  return Array.from({ length: numToGenerate }, () => generateWorkStream());
};
