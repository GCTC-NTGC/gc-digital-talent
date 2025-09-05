import { faker } from "@faker-js/faker/locale/en";

import { Classification } from "@gc-digital-talent/graphql";

export default (): Classification[] => {
  faker.seed(0); // repeatable results
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
      displayName: {
        en: "Technician",
        fr: "Technicien(ne)",
        localized: "Technician",
      },
    },
    {
      id: faker.string.uuid(),
      name,
      group: "IT",
      level: 2,
      minSalary: 65000,
      maxSalary: 94000,
      isAvailableInSearch: true,
      displayName: {
        en: "Analyst",
        fr: "Analyste",
        localized: "Analyst",
      },
    },
    {
      id: faker.string.uuid(),
      name,
      group: "IT",
      level: 3,
      minSalary: 83000,
      maxSalary: 113000,
      isAvailableInSearch: true,
      displayName: {
        en: "Technical Advisor or Team Leader",
        fr: "Conseiller(ère) technique ou Chef d'équipe",
        localized: "Technical Advisor or Team Leader",
      },
    },
    {
      id: faker.string.uuid(),
      name,
      group: "IT",
      level: 4,
      minSalary: 94000,
      maxSalary: 130000,
      isAvailableInSearch: true,
      displayName: {
        en: "Senior Advisor or Manager",
        fr: "Conseiller(ère) principal(e) ou Gestionnaire",
        localized: "Senior Advisor or Manager",
      },
    },
  ];
};
