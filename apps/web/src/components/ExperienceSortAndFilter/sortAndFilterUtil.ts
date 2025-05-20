import { IntlShape } from "react-intl";

import { nodeToString, notEmpty } from "@gc-digital-talent/helpers";
import { PAST_DATE } from "@gc-digital-talent/date-helpers";

import {
  compareByDate,
  ExperienceName,
  getExperienceName,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  SimpleAnyExperience,
} from "~/utils/experienceUtils";
import { ExperienceForDate } from "~/types/experience";

import { FormValues as SortAndFilterValues } from "./ExperienceSortAndFilter";

interface SortAndFilterExperience
  extends SimpleAnyExperience,
    ExperienceName,
    ExperienceForDate {
  id: string;
}

export function sortAndFilterExperiences<T extends SortAndFilterExperience>(
  experiences: T[] | undefined | null,
  sortAndFilterValues: SortAndFilterValues,
  intl: IntlShape,
): T[] {
  const experiencesNotNull = experiences?.filter(notEmpty) ?? [];

  const experiencesDateNormalized = experiencesNotNull.map((experience) => {
    if (isAwardExperience(experience)) {
      const e = {
        ...experience,
        startDate: experience.awardedDate ?? PAST_DATE,
        endDate: experience.awardedDate ?? PAST_DATE,
      };
      return e;
    }
    return experience;
  });

  let experiencesFiltered;
  switch (sortAndFilterValues?.filterBy) {
    case "AwardExperience":
      experiencesFiltered = experiencesDateNormalized.filter(isAwardExperience);
      break;
    case "CommunityExperience":
      experiencesFiltered = experiencesDateNormalized.filter(
        isCommunityExperience,
      );
      break;
    case "EducationExperience":
      experiencesFiltered = experiencesDateNormalized.filter(
        isEducationExperience,
      );
      break;
    case "PersonalExperience":
      experiencesFiltered =
        experiencesDateNormalized.filter(isPersonalExperience);
      break;
    case "WorkExperience":
      experiencesFiltered = experiencesDateNormalized.filter(isWorkExperience);
      break;
    default:
      experiencesFiltered = experiencesDateNormalized;
  }

  const experiencesSorted = experiencesFiltered;
  switch (sortAndFilterValues?.sortBy) {
    case "title_asc":
      experiencesSorted.sort((e1, e2) => {
        const t1 = nodeToString(getExperienceName(e1, intl));
        const t2 = nodeToString(getExperienceName(e2, intl));
        return t1 && t2 ? t1?.localeCompare(t2) : 0;
      });
      break;
    case "date_desc":
      experiencesSorted.sort(compareByDate);
      break;
    default:
      break;
  }

  const experiencesDisplay = experiencesSorted;

  return experiencesDisplay;
}
