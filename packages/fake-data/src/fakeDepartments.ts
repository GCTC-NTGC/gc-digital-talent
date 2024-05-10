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
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Finance (Department of)",
        fr: "Finances (Ministère des)",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Health (Department of)",
        fr: "Santé (Ministère de la)",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Transport (Department of)",
        fr: "Transports (Ministère des)",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Treasury Board Secretariat",
        fr: "Secrétariat du Conseil du Trésor",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Canada School of Public Service",
        fr: "École de la fonction publique du Canada",
      },
    },
    {
      id: faker.string.uuid(),
      departmentNumber: +faker.string.numeric(3),
      name: {
        en: "Environment (Department of the)",
        fr: "Environnement (Ministère de l')",
      },
    },
  ];
};
