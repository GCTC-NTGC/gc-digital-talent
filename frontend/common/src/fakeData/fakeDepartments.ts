import { faker } from "@faker-js/faker";
import { Department } from "../api/generated";

export default (): Department[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [
    {
      id: faker.datatype.uuid(),
      departmentNumber: +faker.random.numeric(3),
      name: {
        en: "Public Service Commission",
        fr: "Commission de la fonction publique",
      },
    },
    {
      id: faker.datatype.uuid(),
      departmentNumber: +faker.random.numeric(3),
      name: {
        en: "Finance (Department of)",
        fr: "Finances (Ministère des)",
      },
    },
    {
      id: faker.datatype.uuid(),
      departmentNumber: +faker.random.numeric(3),
      name: {
        en: "Health (Department of)",
        fr: "Santé (Ministère de la)",
      },
    },
    {
      id: faker.datatype.uuid(),
      departmentNumber: +faker.random.numeric(3),
      name: {
        en: "Transport (Department of)",
        fr: "Transports (Ministère des)",
      },
    },
    {
      id: faker.datatype.uuid(),
      departmentNumber: +faker.random.numeric(3),
      name: {
        en: "Treasury Board Secretariat",
        fr: "Secrétariat du Conseil du Trésor",
      },
    },
  ];
};
