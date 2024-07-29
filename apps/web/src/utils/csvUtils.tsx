import { IntlShape } from "react-intl";

import {
  Locales,
  commonMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  empty,
  insertBetween,
  notEmpty,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { User, Skill, Maybe } from "@gc-digital-talent/graphql";

/**
 * Sanitize a string for use in a CSV
 *
 * - Replaces '"' with '""' for proper double quotes
 * - Removes new lines (\r\n) that create new rows
 *
 * @param value
 * @returns string
 */
export const sanitizeCSVString = (value?: Maybe<string>) => {
  if (!value) return "";
  return value.replace(/"/g, "").replace(/(\r\n|\n|\r)/gm, "");
};

/**
 * Converts a possible boolean
 * to yes or no string
 *
 * @param value Maybe<boolean>
 * @param intl react-intl object
 * @returns React.ReactNode  "yes" or "no"
 */
export const yesOrNo = (value: Maybe<boolean> | undefined, intl: IntlShape) => {
  if (empty(value)) {
    return "";
  }
  return value
    ? intl.formatMessage(commonMessages.yes)
    : intl.formatMessage(commonMessages.no);
};

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
 *  Converts the applicants language preferences
 *  to a string
 *
 * @param english   Maybe<boolean>      If looking for English positions
 * @param french    Maybe<boolean>      If looking for French positions
 * @param bilingual   Maybe<boolean>    If looking for Bilingual positions
 * @param intl react-intl object
 * @returns
 */
export const getLookingForLanguage = (
  english: Maybe<boolean> | undefined,
  french: Maybe<boolean> | undefined,
  bilingual: Maybe<boolean> | undefined,
  intl: IntlShape,
) => {
  if (english && !french && !bilingual) {
    // English Only
    return intl.formatMessage({
      defaultMessage: "English positions",
      id: "vFMPHW",
      description: "English Positions message",
    });
  }
  if (!english && french && !bilingual) {
    // French only
    return intl.formatMessage({
      defaultMessage: "French positions",
      id: "qT9sS0",
      description: "French Positions message",
    });
  }
  if (english && french && !bilingual) {
    // English or French
    return intl.formatMessage({
      defaultMessage: "English or French positions",
      id: "fFznH0",
      description: "English or French Positions message",
    });
  }
  if (bilingual) {
    // Bilingual
    return intl.formatMessage({
      defaultMessage: "Bilingual positions (English and French)",
      id: "6eCvv1",
      description: "Bilingual Positions message",
    });
  }

  return "";
};

/**
 * Converts a possible location preference
 * to a string
 *
 * @param preference  User["locationPreferences"]
 * @param intl react-intl object
 * @returns string
 */
export const getLocationPreference = (
  preferences: User["locationPreferences"],
  intl: IntlShape,
) => {
  const squishedPreference = unpackMaybes(
    preferences?.flatMap((pref) => pref?.label),
  ).map((label) => getLocalizedName(label, intl));

  if (!squishedPreference) {
    return "";
  }

  return listOrEmptyString(squishedPreference);
};

/**
 * Converts possible array of operational requirements
 * to a comma separated list or empty string
 *
 * @param requirements  User["acceptedOperationalRequirements"]
 * @param intl react-intl object
 * @returns string
 */
export const getOperationalRequirements = (
  requirements: User["acceptedOperationalRequirements"],
  intl: IntlShape,
) => {
  const accepted = unpackMaybes(
    requirements?.flatMap((requirement) => requirement?.label),
  ).map((label) => getLocalizedName(label, intl));

  return listOrEmptyString(accepted);
};

/**
 * Converts a possible array of experiences to
 * a flattened comma separated list of skills
 * or an empty string
 *
 * @param experiences Maybe<Maybe<Experience>[]>
 * @param intl react-intl object
 * @returns string
 */
export const flattenExperiencesToSkills = (
  experiences: User["experiences"],
  locale: Locales,
) => {
  const skills = experiences
    ?.map((experience) => {
      return experience?.skills
        ?.map((skill) => {
          return skill.name[locale] || undefined;
        })
        .filter(notEmpty);
    })
    .filter(notEmpty);

  const flattenedSkills = skills
    ? uniqueItems(skills.flatMap((skill) => skill))
    : undefined;

  return listOrEmptyString(flattenedSkills);
};

/**
 * Converts Indigenous communities to column data
 *
 * Note: Does not support legacy communities
 *
 * @param IndigenousCommunity[]
 */
export const getIndigenousCommunities = (
  communities: User["indigenousCommunities"],
  intl: IntlShape,
) => {
  const communityNames = unpackMaybes(
    communities?.flatMap((community) => community?.label),
  ).map((label) => getLocalizedName(label, intl));

  return listOrEmptyString(communityNames);
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
