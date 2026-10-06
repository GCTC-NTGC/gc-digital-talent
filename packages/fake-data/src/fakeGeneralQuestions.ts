import { faker } from "@faker-js/faker/locale/en";

import type { GeneralQuestion } from "@gc-digital-talent/graphql/schema-types";

import toLocalizedString from "./fakeLocalizedString";

export default (): GeneralQuestion[] => {
  return [
    {
      __typename: "GeneralQuestion",
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
    {
      __typename: "GeneralQuestion",
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
    {
      __typename: "GeneralQuestion",
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
  ];
};
