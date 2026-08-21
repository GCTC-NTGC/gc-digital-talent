import type { IntlShape } from "react-intl";

import {
  EducationType,
  EmploymentCategory,
  type LocalizedCafForce,
  type LocalizedEducationType,
  type LocalizedEmploymentCategory,
  type LocalizedString,
} from "@gc-digital-talent/graphql";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  type SimpleAnyExperience,
} from "~/utils/experienceUtils";
import experienceMessages from "~/messages/experienceMessages";

export interface ExperienceName extends SimpleAnyExperience {
  title?: string | null;
  organization?: string | null;
  type?: Partial<LocalizedEducationType> | string | null;
  areaOfStudy?: string | null;
  institution?: string | null;
  role?: string | null;
  employmentCategory?: Partial<LocalizedEmploymentCategory> | null;
  department?: {
    name?: Partial<LocalizedString> | null | undefined;
  } | null;
  cafForce?: Partial<LocalizedCafForce> | null;
}

/**
 * Get the name of any experience type
 *
 * @param AnyExperience experience
 * @return string|ReactNode
 */
export const getV1ExperienceName = <T extends ExperienceName>(
  experience: T,
  intl: IntlShape,
  html = false,
) => {
  if (isAwardExperience(experience) || isPersonalExperience(experience)) {
    return html ? (
      <span className="font-bold">{experience.title}</span>
    ) : (
      experience.title
    );
  }

  if (isCommunityExperience(experience)) {
    const { title, organization } = experience;
    return intl.formatMessage(
      html
        ? experienceMessages.communityAtHtml
        : experienceMessages.communityAt,
      {
        title,
        organization,
      },
    );
  }

  if (isEducationExperience(experience)) {
    const { type, areaOfStudy, institution } = experience;

    // shape of type changed at some point from string to object. this is a imperfect solution.
    let educationType;
    if (typeof type !== "string") {
      educationType =
        type?.value === EducationType.Other
          ? intl.formatMessage({
              defaultMessage: "Other type of education",
              id: "wrKBLf",
              description:
                "First part of education experience title for other type",
            })
          : getLocalizedName(type?.label, intl);
      return intl.formatMessage(
        html
          ? experienceMessages.educationAtHtml
          : experienceMessages.educationAt,
        {
          educationType,
          areaOfStudy,
          institution,
        },
      );
    } else {
      return intl.formatMessage(
        html
          ? experienceMessages.educationAtWithoutTypeHtml
          : experienceMessages.educationAtWithoutType,
        {
          educationType,
          areaOfStudy,
          institution,
        },
      );
    }
  }

  if (isWorkExperience(experience)) {
    const { role, organization, employmentCategory, department, cafForce } =
      experience;
    switch (employmentCategory?.value) {
      case EmploymentCategory.ExternalOrganization:
        return intl.formatMessage(
          html ? experienceMessages.workWithHtml : experienceMessages.workWith,
          {
            role,
            group: organization,
          },
        );
      case EmploymentCategory.GovernmentOfCanada:
        return intl.formatMessage(
          html ? experienceMessages.workWithHtml : experienceMessages.workWith,
          {
            role,
            group: getLocalizedName(department?.name, intl),
          },
        );
      case EmploymentCategory.CanadianArmedForces:
        return intl.formatMessage(
          html ? experienceMessages.workWithHtml : experienceMessages.workWith,
          {
            role,
            group: getLocalizedName(cafForce?.label, intl),
          },
        );
      default:
        return intl.formatMessage(
          html ? experienceMessages.workAtHtml : experienceMessages.workAt,
          {
            role,
            organization,
          },
        );
    }
  }

  // We should never get here but just in case we do, return no provided
  return intl.formatMessage(commonMessages.notProvided);
};
