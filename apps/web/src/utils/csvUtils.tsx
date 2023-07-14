import { IntlShape } from "react-intl";

import {
  User,
  GovEmployeeType,
  Skill,
  Maybe,
  Experience,
  ScreeningQuestionResponse,
} from "@gc-digital-talent/graphql";
import {
  Locales,
  getGenericJobTitles,
  getOperationalRequirement,
  getSimpleGovEmployeeType,
  getWorkRegion,
} from "@gc-digital-talent/i18n";
import { enumToOptions } from "@gc-digital-talent/forms";
import {
  empty,
  insertBetween,
  notEmpty,
  uniqueItems,
} from "@gc-digital-talent/helpers";

import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  getExperienceName,
} from "~/utils/experienceUtils";
import experienceMessages from "~/messages/experienceMessages";

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
 * Sanitizes justifications strings for csv,
 * and separates multiple justifications with a new line.
 *
 * @param value string[] | undefined    Array of items to convert
 * @returns string                      Comma separated list or empty
 */
export const sanitizeJustifications = (values: string[] | undefined) => {
  const sanitizedList = values
    ? values.map((v) => v.replace(/"/g, '""')) // escape double quotes
    : "";
  return sanitizedList ? insertBetween("\n\n", sanitizedList).join("") : "";
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
 * @param type  User["govEmployeeType"]
 * @param intl react-intl object
 * @returns string The employee type
 */
export const employeeTypeToString = (
  type: User["govEmployeeType"],
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
 * @param preference  User["locationPreferences"]
 * @param intl react-intl object
 * @returns string
 */
export const getLocationPreference = (
  preference: User["locationPreferences"],
  intl: IntlShape,
) => {
  const squishedPreference = preference
    ?.map((region) =>
      region ? intl.formatMessage(getWorkRegion(region)) : undefined,
    )
    .filter(notEmpty);

  if (!squishedPreference) {
    return "";
  }

  return listOrEmptyString(squishedPreference.filter(notEmpty));
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
  const accepted = requirements
    ?.map((req) =>
      req ? intl.formatMessage(getOperationalRequirement(req)) : undefined,
    )
    .filter(notEmpty);

  if (!accepted) {
    return "";
  }

  return listOrEmptyString(accepted.filter(notEmpty));
};

/**
 * Converts a possible array of generic job titles
 * to a comma separated list or empty string
 *
 * @param genericTitles Maybe<Maybe<GenericJobTitle>[]>
 * @param intl react-intl object
 * @returns string
 */
export const getExpectedClassifications = (
  genericTitles: User["expectedGenericJobTitles"],
  intl: IntlShape,
) => {
  const expected = genericTitles
    ?.map((title) =>
      title ? intl.formatMessage(getGenericJobTitles(title.key)) : undefined,
    )
    .filter(notEmpty);

  if (!expected) {
    return "";
  }

  return listOrEmptyString(expected.filter(notEmpty));
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
 * Creates an object with the a skill-justification as the key-value pair.
 * The skill must be associated within the skills list,
 * and also be an experience-skill of the User.
 *
 * @param experiences Maybe<Maybe<Experience>[]>
 * @param skills Skill[]
 * @param intl react-intl object
 * @returns { [key]: string }
 */
export const skillKeyAndJustifications = (
  experiences: User["experiences"],
  skills: Skill[],
  intl: IntlShape,
) => {
  // Iterate through experiences.
  // If the experience has a skill that's in the pool's essential and asset skills, then add it to the collection.
  const skillJustifications = experiences
    ?.filter(notEmpty)
    .map((experience) => {
      const getExperienceSkillsFromSkills = experience?.skills
        ?.filter(notEmpty)
        .filter((experienceSkill) =>
          skills.find((skill) => skill.id === experienceSkill.id),
        );
      return getExperienceSkillsFromSkills?.reduce(
        (
          accumulator: { id: string; justification: string }[],
          currentValue: Skill,
        ) => {
          let justification = {
            id: "",
            justification: "",
          };

          if (experience) {
            if (isAwardExperience(experience)) {
              justification = {
                id: currentValue.id,
                justification: `${intl.formatMessage(
                  experienceMessages.awardIssuedBy,
                  {
                    title: experience.title,
                    issuedBy: experience.issuedBy,
                  },
                )}: ${currentValue.experienceSkillRecord?.details}`,
              };
            }

            if (isCommunityExperience(experience)) {
              justification = {
                id: currentValue.id,
                justification: `${intl.formatMessage(
                  experienceMessages.communityAt,
                  {
                    title: experience.title,
                    organization: experience.organization,
                  },
                )}: ${currentValue.experienceSkillRecord?.details}`,
              };
            }

            if (isEducationExperience(experience)) {
              justification = {
                id: currentValue.id,
                justification: `${intl.formatMessage(
                  experienceMessages.educationAt,
                  {
                    areaOfStudy: experience.areaOfStudy,
                    institution: experience.institution,
                  },
                )}: ${currentValue.experienceSkillRecord?.details}`,
              };
            }

            if (isPersonalExperience(experience)) {
              justification = {
                id: currentValue.id,
                justification: `${experience.title}: ${currentValue.experienceSkillRecord?.details}`,
              };
            }

            if (isWorkExperience(experience)) {
              justification = {
                id: currentValue.id,
                justification: `${intl.formatMessage(
                  experienceMessages.workAt,
                  {
                    role: experience.role,
                    organization: experience.organization,
                  },
                )}: ${currentValue.experienceSkillRecord?.details}`,
              };
            }
          }

          return [...accumulator, justification];
        },
        [],
      );
    })
    .flatMap((justification) => justification);

  const keyAndJustifications = skills.reduce((accumulator, currentValue) => {
    const { key, id } = currentValue;
    const justifications = skillJustifications
      ?.filter(notEmpty)
      .filter((sj) => sj.id === id)
      .map((j) => j.justification.trim());
    return {
      ...accumulator,
      [key]: sanitizeJustifications(justifications),
    };
  }, {});

  return keyAndJustifications;
};

/**
 * Converts experiences to comma separated list of titles
 *
 * @param experiences Maybe<Maybe<Experience>[]>
 * @param intl react-intl object
 *
 * @returns string
 */
export const getExperienceTitles = (
  experiences: Maybe<Maybe<Experience>[]>,
  intl: IntlShape,
) => {
  const titles = experiences
    ?.filter(notEmpty)
    .map((experience) => getExperienceName(experience, intl));

  return titles?.join(", ") || "";
};

/**
 * Converts screening question responses to column data
 *
 * @param screeningQuestionResponses[]
 */
export const getScreeningQuestionResponses = (
  responses: Maybe<Maybe<ScreeningQuestionResponse>[]>,
) => {
  let data: Record<string, string> = {};

  responses?.filter(notEmpty).forEach(({ id, screeningQuestion, answer }) => {
    data = {
      ...data,
      // Note: API sends Maybe with everything, but this should never be null or undefined
      [screeningQuestion?.id || id]: answer ?? "",
    };
  });

  return data;
};
