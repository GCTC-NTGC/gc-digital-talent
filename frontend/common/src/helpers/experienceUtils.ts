import { IntlShape } from "react-intl";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
} from "../api/generated";

export type AnyExperienceType =
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export const getExperienceTitle = (
  experience: AnyExperienceType,
  intl: IntlShape,
): string => {
  if ("title" in experience && experience.title) {
    return experience.title;
  }

  if ("areaOfStudy" in experience && experience.areaOfStudy) {
    return experience.areaOfStudy;
  }

  if ("role" in experience && "organization" in experience) {
    if (experience.role && experience.organization) {
      return `${experience.role} (${experience.organization})`;
    }

    if (experience.role) {
      return experience.role;
    }

    if (experience.organization) {
      return experience.organization;
    }
  }

  return intl.formatMessage(
    {
      defaultMessage: "Unknown experience ({id})",
      id: "v9j3+u",
      description:
        "Message displayed when we cannot retrieve an experience title",
    },
    {
      id: experience.id,
    },
  );
};
