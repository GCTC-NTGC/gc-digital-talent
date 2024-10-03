import { IntlShape } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { insertBetween, notEmpty } from "@gc-digital-talent/helpers";
import { Skill } from "@gc-digital-talent/graphql";

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
 * Converts possible array of skill families
 * to a comma separated list or empty string
 *
 * @param families  Skill["families"]
 * @param intl react-intl object
 * @returns string
 */
export const getSkillFamilies = (
  families: Skill["families"],
  intl: IntlShape,
) => {
  const familyNames = families
    ?.filter(notEmpty)
    .map((family) => getLocalizedName(family.name, intl));

  return listOrEmptyString(familyNames);
};
