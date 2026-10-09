import { faker } from "@faker-js/faker/locale/en";

import toLocalizedString from "./fakeLocalizedString";

export default () => {
  return [
    {
      __typename: "GeneralQuestion" as const,
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
    {
      __typename: "GeneralQuestion" as const,
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
    {
      __typename: "GeneralQuestion" as const,
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
  ];
};
