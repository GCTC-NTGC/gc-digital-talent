import { faker } from "@faker-js/faker";

import { Department, Team } from "@gc-digital-talent/graphql";
import toLocalizedString from "./fakeLocalizedString";

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
    description: toLocalizedString(faker.lorem.paragraph()),
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
