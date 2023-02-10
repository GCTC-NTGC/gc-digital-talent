import { faker } from "@faker-js/faker";

import { Department, Team } from "@gc-digital-talent/graphql";

import fakeDepartments from "./fakeDepartments";

interface GenerateTeamArgs {
  name: Team["displayName"];
  departments: Array<Department>;
}

const mockDepartments = fakeDepartments();

const generateTeam = ({ name, departments }: GenerateTeamArgs): Team => {
  faker.setLocale("en");
  const teamDepartments = faker.helpers.arrayElements<Department>(
    departments,
    Math.floor(Math.random() * 4),
  );

  return {
    id: faker.datatype.uuid(),
    name: faker.datatype.string(),
    contactEmail: faker.internet.email(),
    displayName: name,
    departments: teamDepartments,
  };
};

export default (amount = 10): Team[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  const teams = Array(amount - 1)
    .fill(0)
    .map(() => {
      const name = faker.company.name();

      return generateTeam({
        name: {
          en: `${name} EN`,
          fr: `${name} FR`,
        },
        departments: mockDepartments,
      });
    });

  return [
    // Always have our default team
    generateTeam({
      name: {
        en: "Digital Community Management",
        fr: "Gestion de la collectivité numérique",
      },
      departments: mockDepartments,
    }),
    ...teams,
  ];
};
