import { faker } from "@faker-js/faker/locale/en";

import type { ScreeningQuestion } from "@gc-digital-talent/graphql/schema-types";

import toLocalizedString from "./fakeLocalizedString";

export default (): ScreeningQuestion[] => {
  return [
    {
      __typename: "ScreeningQuestion",
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
    {
      __typename: "ScreeningQuestion",
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
    {
      __typename: "ScreeningQuestion",
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
  ];
};
