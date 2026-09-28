import { faker } from "@faker-js/faker/locale/en";

const names = [
  ["Public Service Commission", "Commission de la fonction publique"],
  ["Finance (Department of)", "Finances (Ministère des)"],
  ["Health (Department of)", "Santé (Ministère de la)"],
  ["Transport (Department of)", "Transports (Ministère des)"],
  ["Treasury Board Secretariat", "Secrétariat du Conseil du Trésor"],
  ["Canada School of Public Service", "École de la fonction publique du Canada"],
  ["Environment (Department of the)", "Environnement (Ministère de l')"],
];

const generateDepartment = (en: string, fr: string) => ({
  __typename: "Department" as const,
  id: faker.string.uuid(),
  departmentNumber: +faker.string.numeric(3),
  name: {
    __typename: "LocalizedString" as const,
    en,
    fr,
    localized: en,
  },
  orgIdentifier: null,
  isCorePublicAdministration: true,
  isCentralAgency: false,
  isScience: false,
  isRegulatory: false,
  archivedAt: null,
  size: null,
});

export default (preventFakerReset = false) => {
  if (!preventFakerReset) {
    faker.seed(0); // repeatable results
  }
  return names.map(([en, fr]) => generateDepartment(en, fr));
};
