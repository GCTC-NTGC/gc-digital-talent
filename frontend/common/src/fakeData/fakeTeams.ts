import { faker } from "@faker-js/faker";

import { toLocalizedString } from "../helpers/fake";
import { Department, Team } from "../api/generated";
import fakeDepartments from "./fakeDepartments";

const generateTeam = (departments: Department[]): Team => {
  const index = faker.datatype.number({
    min: 0,
    max: departments.length - 1,
    precision: 1,
  });
  return {
    id: faker.datatype.uuid(),
    name: faker.datatype.string(),
    contactEmail: faker.internet.email(),
    displayName: toLocalizedString(faker.company.name()),
    departments: [departments[index]],
  };
};

export default (
  numToGenerate = 10,
  departments = fakeDepartments(),
): Team[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map(() => generateTeam(departments));
};
