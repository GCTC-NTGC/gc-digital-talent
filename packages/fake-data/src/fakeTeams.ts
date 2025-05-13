import { faker } from "@faker-js/faker/locale/en";

import { Department, Team } from "@gc-digital-talent/graphql";

import fakeDepartments from "./fakeDepartments";

const generateTeam = (departments: Department[]): Team => {
  const index = faker.number.int({
    min: 0,
    max: departments.length - 1,
  });
  return {
    id: faker.string.uuid(),
    name: faker.string.sample(),
    departments: [departments[index]],
  };
};

export default (
  numToGenerate = 10,
  departments = fakeDepartments(),
): Team[] => {
  faker.seed(0); // repeatable results

  return Array.from({ length: numToGenerate }, () => generateTeam(departments));
};
