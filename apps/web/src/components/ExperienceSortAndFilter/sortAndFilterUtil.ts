/* eslint-disable import/prefer-default-export */
import { Experience } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { ExperienceForDate } from "~/types/experience";
import { PAST_DATE } from "@gc-digital-talent/date-helpers";

import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";

import { FormValues as SortAndFilterValues } from "./ExperienceSortAndFilter";

export function sortAndFilterExperiences(
  experiences: Experience[] | undefined,
  sortAndFilterValues: SortAndFilterValues,
): Experience[] {
  const experiencesNotNull = experiences?.filter(notEmpty) ?? [];

  const experiencesDateNormalized: ExperienceForDate[] = experiencesNotNull.map(
    (experience) => {
      if (isAwardExperience(experience)) {
        const e: ExperienceForDate = {
          ...experience,
          startDate: experience.awardedDate ?? PAST_DATE,
          endDate: experience.awardedDate ?? PAST_DATE,
        };
        return e;
      }
      return experience;
    },
  );

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
    case "date_asc":
      experiencesSorted.sort((e1, e2) => {
        return compareByDate(e1, e2) * -1;
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
