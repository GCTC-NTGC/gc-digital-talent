import { faker } from "@faker-js/faker";
import { Classification } from "../api/generated";

export default (): Classification[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Information Technology",
        fr: "Technologie de l'information",
      },
      group: "IT",
      level: 1,
      minSalary: 50000,
      maxSalary: 80000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Information Technology",
        fr: "Technologie de l'information",
      },
      group: "IT",
      level: 2,
      minSalary: 65000,
      maxSalary: 94000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Information Technology",
        fr: "Technologie de l'information",
      },
      group: "IT",
      level: 3,
      minSalary: 83000,
      maxSalary: 113000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Information Technology",
        fr: "Technologie de l'information",
      },
      group: "IT",
      level: 4,
      minSalary: 94000,
      maxSalary: 130000,
    },
  ];
};
