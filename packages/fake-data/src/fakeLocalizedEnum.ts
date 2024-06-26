import { faker } from "@faker-js/faker/locale/en";

import { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

import toLocalizedString from "./fakeLocalizedString";

faker.seed();

function enumToString(value: string) {
  return value.split("_").join(" ").toLowerCase();
}

function toLocalizedEnum<T extends string>(value: T): GenericLocalizedEnum<T> {
  return {
    value,
    label: toLocalizedString(enumToString(value)),
  };
}

export default toLocalizedEnum;
