import { GetCmoAssetsQuery } from "../api/generated";

export default (): GetCmoAssetsQuery["cmoAssets"] => [
  {
    id: "1",
    key: "application-development",
    name: {
      en: "Application Development",
      fr: "Développement d'applications",
    },
    description: {
      en: "Ipsum Lorem",
      fr: "Ipsé Lorume",
    },
  },
  {
    id: "2",
    key: "quality-assurance",
    name: {
      en: "Quality Assurance",
      fr: "Assurance qualités",
    },
    description: {
      en: "Ipsum Lorem",
      fr: "Ipsé Lorume",
    },
  },
  {
    id: "3",
    key: "enterprise-architecture",
    name: {
      en: "Enterprise Architecture",
      fr: "Architecture d'entreprise",
    },
    description: {
      en: "Ipsum Lorem",
      fr: "Ipsé Lorume",
    },
  },
  {
    id: "4",
    key: "it-project-management",
    name: {
      en: "IT Project Management",
      fr: "Gestion de projets TI",
    },
    description: {
      en: "Ipsum Lorem",
      fr: "Ipsé Lorume",
    },
  },
];
