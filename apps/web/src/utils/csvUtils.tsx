import { insertBetween, unpackMaybes } from "@gc-digital-talent/helpers";

/**
 * Converts a possible array to
 * a comma separated list
 *
 * @param value string[] | undefined    Array of items to convert
 * @returns string                      Comma separated list or empty
 */
const listOrEmptyString = (value: string[] | undefined) => {
  return value ? insertBetween(", ", value).join("") : "";
};

/**
 * Converts possible array of skill family names
 * to a comma separated list or empty string
 *
 * @param familyNames Localized skill family names
 * @returns string
 */
export const getSkillFamilies = (
  familyNames: (string | null | undefined)[] | null | undefined,
) => {
  return listOrEmptyString(unpackMaybes(familyNames));
};
