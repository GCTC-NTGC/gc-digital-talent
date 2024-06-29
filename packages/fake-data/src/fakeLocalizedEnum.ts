import { faker } from "@faker-js/faker/locale/en";

import { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

import toLocalizedString from "./fakeLocalizedString";

faker.seed();

const pascalSplitRegex = /(?=[A-Z])/;

function enumToString(value: string, delimeter: string | RegExp = "_") {
  const string = value.split(delimeter).join(" ").toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function pascalToScreamingSnake(value: string) {
  return value.split(pascalSplitRegex).join("_").toUpperCase();
}

function toLocalizedEnum<T extends string>(
  value: T,
  delimeter?: string | RegExp,
): GenericLocalizedEnum<T> {
  return {
    value: pascalToScreamingSnake(value),
    label: toLocalizedString(enumToString(value, delimeter)),
  };
}

type EnumType = { [k: number]: string };

export function fakeLocalizedEnum<T extends EnumType>(enumerable: T) {
  return Object.keys(enumerable).map((key) =>
    toLocalizedEnum(key, pascalSplitRegex),
  );
}

export default toLocalizedEnum;
