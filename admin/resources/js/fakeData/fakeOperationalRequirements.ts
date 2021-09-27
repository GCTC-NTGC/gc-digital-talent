import { GetOperationalRequirementsQuery } from "../api/generated";

export default (): GetOperationalRequirementsQuery["operationalRequirements"] => [
  {
    id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
    key: "overtime",
    name: {
      en: "Overtime as required",
      fr: "Heures supplémentaires selon les besoins",
    },
    description: {
      en: "",
      fr: "",
    },
  },
  {
    id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
    key: "shift_work",
    name: {
      en: "Shift work",
      fr: "Travail posté",
    },
    description: {
      en: "",
      fr: "",
    },
  },
  {
    id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
    key: "on_call",
    name: {
      en: "24/7 on-call",
      fr: "Garde 24/7",
    },
    description: {
      en: "",
      fr: "",
    },
  },
  {
    id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
    key: "travel",
    name: {
      en: "Travel as required",
      fr: "Déplacements selon les besoins",
    },
    description: {
      en: "",
      fr: "",
    },
  },
  {
    id: "52191788-5649-417f-8b49-520dcf664a18",
    key: "transport_equipment",
    name: {
      en: "Transport equipment up to 20kg",
      fr: "Transport de matériel jusqu'à 20 kg",
    },
    description: {
      en: "",
      fr: "",
    },
  },
  {
    id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
    key: "drivers_license",
    name: {
      en: "Driver's license",
      fr: "Permis de conduire",
    },
    description: {
      en: "",
      fr: "",
    },
  },
];
