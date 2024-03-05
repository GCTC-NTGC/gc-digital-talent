import { faker } from "@faker-js/faker";

import { GeneralQuestion } from "@gc-digital-talent/graphql";

import toLocalizedString from "./fakeLocalizedString";

export default (): GeneralQuestion[] => {
  return [
    {
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
    {
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
    {
      id: faker.string.uuid(),
      question: toLocalizedString(`${faker.lorem.sentence()}?`),
    },
  ];
};
