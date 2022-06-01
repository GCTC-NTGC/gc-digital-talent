import { faker } from "@faker-js/faker";
import { CmoAsset } from "../api/generated";

export default (): CmoAsset[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [
    {
      id: faker.datatype.uuid(),
      key: "app_dev",
      name: {
        en: "Application Development",
        fr: "Développement d'applications",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "app_testing",
      name: {
        en: "Application Testing / Quality Assurance",
        fr: "Test d'application / Assurance qualité",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "cybersecurity",
      name: {
        en: "Cybersecurity / Information Security / IT Security",
        fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "data_science",
      name: {
        en: "Data Science / Analysis",
        fr: "Science des données / Analyse",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "db_admin",
      name: {
        en: "Database Administration",
        fr: "Administration de bases de données",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "enterprise_architecture",
      name: {
        en: "Enterprise Architecture (EA)",
        fr: "Architecture d'entreprise (EA)",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "information_management",
      name: {
        en: "Information Management (IM)",
        fr: "Gestion de l'information (IM)",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "infrastructure_ops",
      name: {
        en: "Infrastructure/Operations",
        fr: "Infrastructure/Opérations",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "project_management",
      name: {
        en: "IT Business Analyst / IT Project Management",
        fr: "Analyste d'affaires TI / Gestion de projets TI",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
  ];
};
