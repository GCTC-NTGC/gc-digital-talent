import { faker } from "@faker-js/faker/locale/en";

import { Department } from "@gc-digital-talent/graphql";

export default (): Department[] => {
  faker.seed(0); // repeatable results
  return [
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Public Service Commission",
        fr: "Commission de la fonction publique",
        localized: "Public Service Commission",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Finance (Department of)",
        fr: "Finances (Ministère des)",
        localized: "Finance (Department of)",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Health (Department of)",
        fr: "Santé (Ministère de la)",
        localized: "Health (Department of)",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Transport (Department of)",
        fr: "Transports (Ministère des)",
        localized: "Transport (Department of)",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Treasury Board Secretariat",
        fr: "Secrétariat du Conseil du Trésor",
        localized: "Treasury Board Secretariat",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Canada School of Public Service",
        fr: "École de la fonction publique du Canada",
        localized: "Canada School of Public Service",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Environment (Department of the)",
        fr: "Environnement (Ministère de l')",
        localized: "Environment (Department of the)",
      },
    },
  ];
};
