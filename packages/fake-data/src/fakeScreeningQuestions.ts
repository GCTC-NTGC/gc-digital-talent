import { faker } from "@faker-js/faker";

import { ScreeningQuestion } from "@gc-digital-talent/graphql";

import toLocalizedString from "./fakeLocalizedString";

export default (): ScreeningQuestion[] => {
  faker.seed(0); // repeatable results

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
