import faker from "faker";
import { OperationalRequirement } from "../api/generated";

export default (): OperationalRequirement[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [
    {
      id: faker.datatype.uuid(),
      key: "overtime",
      name: {
        en: "Overtime as required",
        fr: "Heures supplémentaires selon les besoins",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "shift_work",
      name: {
        en: "Shift work",
        fr: "Travail posté",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "on_call",
      name: {
        en: "24/7 on-call",
        fr: "Garde 24/7",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "travel",
      name: {
        en: "Travel as required",
        fr: "Déplacements selon les besoins",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "transport_equipment",
      name: {
        en: "Transport equipment up to 20kg",
        fr: "Transport de matériel jusqu'à 20 kg",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
    {
      id: faker.datatype.uuid(),
      key: "drivers_license",
      name: {
        en: "Driver's license",
        fr: "Permis de conduire",
      },
      description: {
        en: `EN ${faker.lorem.sentence()}`,
        fr: `FR ${faker.lorem.sentence()}`,
      },
    },
  ];
};
