import { DepartmentsQuery } from "../api/generated";

export default (): DepartmentsQuery["departments"] => [
  {
    id: "1",
    department_number: 1,
    name: {
      en: "Agriculture and Agri-Food",
      fr: "Agriculture et de l'Agroalimentaire",
    },
  },
  {
    id: "2",
    department_number: 2,
    name: {
      en: "Office of the Auditor General",
      fr: "Bureau du vérificateur général",
    },
  },
  {
    id: "3",
    department_number: 4,
    name: {
      en: "Public Service Commission",
      fr: "Commission de la fonction publique",
    },
  },
  {
    id: "4",
    department_number: 5,
    name: {
      en: "Foreign Affairs",
      fr: "Affaires étrangères",
    },
  },
  {
    id: "5",
    department_number: 6,
    name: {
      en: "Finance",
      fr: "Finances",
    },
  },
];
