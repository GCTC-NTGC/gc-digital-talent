import { GetOperationalRequirementsQuery } from "../api/generated";

export default (): GetOperationalRequirementsQuery["operationalRequirements"] => [
  {
    id: 1,
    key: "overtime-as-required",
    name: {
      en: "Overtime as Required",
      fr: "Heures supplémentaires au besoin",
    },
    description: {
      en: "Ipsum Lorem",
      fr: "Ipsé Lorume",
    },
  },
  {
    id: 2,
    key: "shift-work",
    name: {
      en: "Shift Work",
      fr: "Travail posté",
    },
    description: {
      en: "Ipsum Lorem",
      fr: "Ipsé Lorume",
    },
  },
  {
    id: 3,
    key: "travel-as-required",
    name: {
      en: "Travel as Required",
      fr: "Voyage au besoin",
    },
    description: {
      en: "Ipsum Lorem",
      fr: "Ipsé Lorume",
    },
  },
];
