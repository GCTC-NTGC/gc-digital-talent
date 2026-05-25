import { faker } from "@faker-js/faker/locale/en";

import type { Classification } from "@gc-digital-talent/graphql";

export default (): Classification[] => {
  faker.seed(0); // repeatable results
  const group = "IT";
  const name = {
    en: "Information Technology",
    fr: "Technologie de l'information",
    localized: "Information Technology",
  };
  return [
    {
      id: faker.string.uuid(),
      name,
      group: "IT",
      level: 1,
      minSalary: 50000,
      maxSalary: 80000,
      isAvailableInSearch: true,
      groupAndLevel: `${group}-01`,
      displayName: `${group}-01: ${name.localized}`,
    },
    {
      id: faker.string.uuid(),
      name,
      group: "IT",
      level: 2,
      minSalary: 65000,
      maxSalary: 94000,
      isAvailableInSearch: true,
      groupAndLevel: `${group}-02`,
      displayName: `${group}-02: ${name.localized}`,
    },
    {
      id: faker.string.uuid(),
      name,
      group: "IT",
      level: 3,
      minSalary: 83000,
      maxSalary: 113000,
      isAvailableInSearch: true,
      groupAndLevel: `${group}-03`,
      displayName: `${group}-03: ${name.localized}`,
    },
    {
      id: faker.string.uuid(),
      name,
      group: "IT",
      level: 4,
      minSalary: 94000,
      maxSalary: 130000,
      isAvailableInSearch: true,
      groupAndLevel: `${group}-04`,
      displayName: `${group}-04: ${name.localized}`,
    },
  ];
};
