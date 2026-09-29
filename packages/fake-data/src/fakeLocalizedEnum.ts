import { faker } from "@faker-js/faker/locale/en";

import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

import toLocalizedString from "./fakeLocalizedString";

faker.seed();

const pascalSplitRegex = /(?=[A-Z])/;

/**
 * Convert an enum value to a more human-readable format
 *
 * @param value - The string to be transformed
 * @param [delimiter="_"] - The parameter to split on
 * @returns New string
 */
function enumToString(value: string, delimiter: string | RegExp = "_") {
  const string = value.split(delimiter).join(" ").toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts a string in PascalCase to SCREAMING_SNAKE_CASE
 *
 * @param value - The string to be transformed
 * @returns New string
 */
function pascalToScreamingSnake<T extends string>(value: T): T {
  return value.split(pascalSplitRegex).join("_").toUpperCase() as T;
}

type EnumCase = "pascal" | "screaming_snake";

/**
 * Casts an enum case to a localized enum
 *
 * NOTE: This is not a real enum but a mocked one
 *
 * @param value - The value to be cast
 * @param delimiter  - Character to split the string on
 * @param [enumCase="screaming_snake"] - Case of the enum value
 * @returns - Localized version of the enum
 */
function toLocalizedEnum<T extends string, N extends string>(
  value: T,
  typename: N,
  delimiter?: string | RegExp,
  enumCase: EnumCase = "screaming_snake",
): GenericLocalizedEnum<T> & { __typename: N } {
  return {
    __typename: typename,
    value: enumCase === "pascal" ? pascalToScreamingSnake(value) : value,
    label: toLocalizedString(enumToString(value, delimiter)),
  };
}

type EnumType = Record<number, string>;

/**
 * Converts an enum to a localized version
 *
 * @param enumerable - The enum to be cast
 * @returns Array of the enum as localized enums
 */
export function fakeLocalizedEnum<T extends EnumType, N extends string>(
  enumerable: T,
  typename: N,
): (GenericLocalizedEnum<T[keyof T]> & { __typename: N })[] {
  return Object.keys(enumerable)
    .filter((k) => isNaN(Number(k)))
    .map((key) =>
      toLocalizedEnum(key, typename, pascalSplitRegex, "pascal"),
    ) as (GenericLocalizedEnum<T[keyof T]> & { __typename: N })[];
}

export default toLocalizedEnum;
