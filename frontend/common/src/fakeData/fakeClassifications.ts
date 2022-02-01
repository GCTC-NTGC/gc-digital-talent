import faker from "faker";
import { Classification } from "../api/generated";

export default (): Classification[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Computer Systems",
        fr: "Systèmes d'ordinateurs",
      },
      group: "CS",
      level: 1,
      minSalary: 50000,
      maxSalary: 80000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Computer Systems",
        fr: "Systèmes d'ordinateurs",
      },
      group: "CS",
      level: 2,
      minSalary: 65000,
      maxSalary: 94000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Computer Systems",
        fr: "Systèmes d'ordinateurs",
      },
      group: "CS",
      level: 3,
      minSalary: 83000,
      maxSalary: 113000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Computer Systems",
        fr: "Systèmes d'ordinateurs",
      },
      group: "CS",
      level: 4,
      minSalary: 94000,
      maxSalary: 130000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Computer Systems",
        fr: "Systèmes d'ordinateurs",
      },
      group: "CS",
      level: 5,
      minSalary: 105000,
      maxSalary: 157000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Administrative Services",
        fr: "Services des programmes et de l'administration",
      },
      group: "AS",
      level: 1,
      minSalary: 50000,
      maxSalary: 80000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Administrative Services",
        fr: "Services des programmes et de l'administration",
      },
      group: "AS",
      level: 2,
      minSalary: 65000,
      maxSalary: 94000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Administrative Services",
        fr: "Services des programmes et de l'administration",
      },
      group: "AS",
      level: 3,
      minSalary: 83000,
      maxSalary: 113000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Administrative Services",
        fr: "Services des programmes et de l'administration",
      },
      group: "AS",
      level: 4,
      minSalary: 94000,
      maxSalary: 130000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Administrative Services",
        fr: "Services des programmes et de l'administration",
      },
      group: "AS",
      level: 5,
      minSalary: 105000,
      maxSalary: 157000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Economics and Social Science Services",
        fr: "Économique et services de sciences sociales",
      },
      group: "EC",
      level: 1,
      minSalary: 50000,
      maxSalary: 80000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Economics and Social Science Services",
        fr: "Économique et services de sciences sociales",
      },
      group: "EC",
      level: 2,
      minSalary: 65000,
      maxSalary: 94000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Economics and Social Science Services",
        fr: "Économique et services de sciences sociales",
      },
      group: "EC",
      level: 3,
      minSalary: 83000,
      maxSalary: 113000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Economics and Social Science Services",
        fr: "Économique et services de sciences sociales",
      },
      group: "EC",
      level: 4,
      minSalary: 94000,
      maxSalary: 130000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Economics and Social Science Services",
        fr: "Économique et services de sciences sociales",
      },
      group: "EC",
      level: 5,
      minSalary: 105000,
      maxSalary: 157000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Programme Administration",
        fr: "Administration des programmes",
      },
      group: "PM",
      level: 1,
      minSalary: 50000,
      maxSalary: 80000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Programme Administration",
        fr: "Administration des programmes",
      },
      group: "PM",
      level: 2,
      minSalary: 65000,
      maxSalary: 94000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Programme Administration",
        fr: "Administration des programmes",
      },
      group: "PM",
      level: 3,
      minSalary: 83000,
      maxSalary: 113000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Programme Administration",
        fr: "Administration des programmes",
      },
      group: "PM",
      level: 4,
      minSalary: 94000,
      maxSalary: 130000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Programme Administration",
        fr: "Administration des programmes",
      },
      group: "PM",
      level: 5,
      minSalary: 105000,
      maxSalary: 157000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Information Services",
        fr: "Services d'information",
      },
      group: "IS",
      level: 1,
      minSalary: 50000,
      maxSalary: 80000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Information Services",
        fr: "Services d'information",
      },
      group: "IS",
      level: 2,
      minSalary: 65000,
      maxSalary: 94000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Information Services",
        fr: "Services d'information",
      },
      group: "IS",
      level: 3,
      minSalary: 83000,
      maxSalary: 113000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Information Services",
        fr: "Services d'information",
      },
      group: "IS",
      level: 4,
      minSalary: 94000,
      maxSalary: 130000,
    },
    {
      id: faker.datatype.uuid(),
      name: {
        en: "Information Services",
        fr: "Services d'information",
      },
      group: "IS",
      level: 5,
      minSalary: 105000,
      maxSalary: 157000,
    },
  ];
};
