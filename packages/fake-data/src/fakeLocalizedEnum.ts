import { faker } from "@faker-js/faker/locale/en";

import { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

import toLocalizedString from "./fakeLocalizedString";

faker.seed();

const pascalSplitRegex = /(?=[A-Z])/;

function enumToString(value: string, delimiter: string | RegExp = "_") {
  const string = value.split(delimiter).join(" ").toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function pascalToScreamingSnake<T extends string>(value: T): T {
  return value.split(pascalSplitRegex).join("_").toUpperCase() as T;
}

type EnumCase = "pascal" | "screaming_snake";

function toLocalizedEnum<T extends string>(
  value: T,
  delimiter?: string | RegExp,
  enumCase: EnumCase = "screaming_snake",
): GenericLocalizedEnum<T> {
  return {
    value: enumCase === "pascal" ? pascalToScreamingSnake(value) : value,
    label: toLocalizedString(enumToString(value, delimiter)),
  };
}

type EnumType = { [k: number]: string };

export function fakeLocalizedEnum<T extends EnumType>(enumerable: T) {
  return Object.keys(enumerable).map((key) =>
    toLocalizedEnum(key, pascalSplitRegex, "pascal"),
  );
}

export default toLocalizedEnum;
