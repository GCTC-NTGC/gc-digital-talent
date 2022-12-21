import { Maybe } from "graphql/jsutils/Maybe";
import { IntlShape } from "react-intl";
import {
  getOperationalRequirement,
  getSimpleGovEmployeeType,
  getWorkRegion,
} from "../constants/localizedConstants";
import { Applicant, GovEmployeeType } from "../api/generated";
import { enumToOptions } from "./formUtils";
import { Locales } from "./localize";
import { empty, insertBetween, notEmpty, uniqueItems } from "./util";

/**
 * Converts a possible boolean
 * to yes or no string
 *
 * @param value Maybe<boolean>
 * @param intl react-intl object
 * @returns React.ReactNode  "yes" or "no"
 */
export const yesOrNo = (value: Maybe<boolean>, intl: IntlShape) => {
  if (empty(value)) {
    return "";
  }
  return value
    ? intl.formatMessage({
        defaultMessage: "Yes",
        id: "UOO1gW",
        description: "Message for when a value is true",
      })
    : intl.formatMessage({
        defaultMessage: "No",
        id: "q7bz0J",
        description: "Message for when a value is false",
      });
};

/**
 * Converts a possible array to
 * a comma separated list
 *
 * @param value string[] | undefined    Array of items to convert
 * @returns string                      Comma separated list or empty
 */
export const listOrEmptyString = (value: string[] | undefined) => {
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
  english: Maybe<boolean>,
  french: Maybe<boolean>,
  bilingual: Maybe<boolean>,
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
 * Converts possible Employee Type
 * to a string
 *
 * @param type  Applicant["govEmployeeType"]
 * @param intl react-intl object
 * @returns string The employee type
 */
export const employeeTypeToString = (
  type: Applicant["govEmployeeType"],
  intl: IntlShape,
) => {
  const govEmployeeTypeId =
    enumToOptions(GovEmployeeType).find(
      (govEmployeeType) => govEmployeeType.value === type,
    )?.value || null;

  return govEmployeeTypeId
    ? intl.formatMessage(getSimpleGovEmployeeType(govEmployeeTypeId))
    : "";
};

/**
 * Converts a possible location preference
 * to a string
 *
 * @param preference  Applicant["locationPreferences"]
 * @param intl react-intl object
 * @returns string
 */
export const getLocationPreference = (
  preference: Applicant["locationPreferences"],
  intl: IntlShape,
) => {
  const squishedPreference = preference
    ?.map((region) =>
      region ? intl.formatMessage(getWorkRegion(region)) : undefined,
    )
    .filter(notEmpty);
  return listOrEmptyString(squishedPreference);
};

/**
 * Converts possible array of operational requirements
 * to a comma separated list or empty string
 *
 * @param requirements  Applicant["acceptedOperationalRequirements"]
 * @param intl react-intl object
 * @returns string
 */
export const getOperationalRequirements = (
  requirements: Applicant["acceptedOperationalRequirements"],
  intl: IntlShape,
) => {
  const accepted = requirements
    ?.map((req) =>
      req ? intl.formatMessage(getOperationalRequirement(req)) : undefined,
    )
    .filter(notEmpty);

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
  experiences: Applicant["experiences"],
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
