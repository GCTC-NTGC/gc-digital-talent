import { faker } from "@faker-js/faker";
// import {Team}from "../api/generated";

// TO DO: Remove after #5548
import { Department } from "../api/generated";
import fakeDepartments from "./fakeDepartments";

type Team = {
  id: string;
  name: string;
  contactEmail: string;
  displayName: {
    en: string;
    fr: string;
  };
  departments: Department[];
};

interface GenerateTeamArgs {
  name: Team["displayName"];
  departments: Team["departments"];
}

const mockDepartments = fakeDepartments();

const generateTeam = ({ name, departments }: GenerateTeamArgs): Team => {
  faker.setLocale("en");
  const teamDepartments = faker.helpers.arrayElement<Department>(departments);

  return {
    id: faker.datatype.uuid(),
    name: faker.datatype.string(),
    contactEmail: faker.internet.email(),
    displayName: name,
    departments: [teamDepartments],
  };
};

export default (): Team[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [
    generateTeam({
      name: {
        en: "Digital Community Management",
        fr: "Gestion de la collectivité numérique",
      },
      departments: mockDepartments,
    }),
  ];
};
