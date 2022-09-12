/* eslint-disable no-underscore-dangle */
import { notEmpty } from "../helpers/util";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  Skill,
  WorkExperience,
} from "../api/generated";

export type AnyExperience =
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export const isAwardExperience = (e: AnyExperience): e is AwardExperience =>
  e.__typename === "AwardExperience";
export const isCommunityExperience = (
  e: AnyExperience,
): e is CommunityExperience => e.__typename === "CommunityExperience";
export const isEducationExperience = (
  e: AnyExperience,
): e is EducationExperience => e.__typename === "EducationExperience";
export const isPersonalExperience = (
  e: AnyExperience,
): e is PersonalExperience => e.__typename === "PersonalExperience";
export const isWorkExperience = (e: AnyExperience): e is WorkExperience =>
  e.__typename === "WorkExperience";

export type ExperienceForDate =
  | (AwardExperience & { startDate: string; endDate: string })
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export const compareByDate = (e1: ExperienceForDate, e2: ExperienceForDate) => {
  const e1EndDate = e1.endDate ? new Date(e1.endDate).getTime() : null;
  const e2EndDate = e2.endDate ? new Date(e2.endDate).getTime() : null;
  const e1StartDate = e1.startDate ? new Date(e1.startDate).getTime() : -1;
  const e2StartDate = e2.startDate ? new Date(e2.startDate).getTime() : -1;

  // All items with no end date should be at the top and sorted by most recent start date.
  if (!e1EndDate && !e2EndDate) {
    return e2StartDate - e1StartDate;
  }

  if (!e1EndDate) {
    return -1;
  }

  if (!e2EndDate) {
    return 1;
  }

  // Items with end date should be sorted by most recent end date at top.
  return e2EndDate - e1EndDate;
};

type MergedExperiences = Array<
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience
>;

export const flattenExperienceSkills = (
  experiences: MergedExperiences,
): Skill[] => {
  return experiences
    .map((experience) => {
      const { skills } = experience;
      return skills?.filter(notEmpty);
    })
    .filter(notEmpty)
    .flatMap((skill) => skill);
};
