import { faker } from "@faker-js/faker/locale/en";

import type { Department } from "@gc-digital-talent/graphql/schema-types";

export default (preventFakerReset = false): Department[] => {
  if (!preventFakerReset) {
    faker.seed(0); // repeatable results
  }
  return [
    {
      __typename: "Department",
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        __typename: "LocalizedString",
        en: "Public Service Commission",
        fr: "Commission de la fonction publique",
        localized: "Public Service Commission",
      },
    },
    {
      __typename: "Department",
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        __typename: "LocalizedString",
        en: "Finance (Department of)",
        fr: "Finances (Ministère des)",
        localized: "Finance (Department of)",
      },
    },
    {
      __typename: "Department",
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        __typename: "LocalizedString",
        en: "Health (Department of)",
        fr: "Santé (Ministère de la)",
        localized: "Health (Department of)",
      },
    },
    {
      __typename: "Department",
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        __typename: "LocalizedString",
        en: "Transport (Department of)",
        fr: "Transports (Ministère des)",
        localized: "Transport (Department of)",
      },
    },
    {
      __typename: "Department",
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        __typename: "LocalizedString",
        en: "Treasury Board Secretariat",
        fr: "Secrétariat du Conseil du Trésor",
        localized: "Treasury Board Secretariat",
      },
    },
    {
      __typename: "Department",
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        __typename: "LocalizedString",
        en: "Canada School of Public Service",
        fr: "École de la fonction publique du Canada",
        localized: "Canada School of Public Service",
      },
    },
    {
      __typename: "Department",
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        __typename: "LocalizedString",
        en: "Environment (Department of the)",
        fr: "Environnement (Ministère de l')",
        localized: "Environment (Department of the)",
      },
    },
  ];
};
