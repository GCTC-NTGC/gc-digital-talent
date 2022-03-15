import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience
} from "../../api/generated";

export type AnyExperience = AwardExperience |
  CommunityExperience |
  EducationExperience |
  PersonalExperience |
  WorkExperience;
export const isAwardExperience = (e: AnyExperience): e is AwardExperience => e.__typename === "AwardExperience";
export const isCommunityExperience = (e: AnyExperience): e is CommunityExperience => e.__typename === "CommunityExperience";
export const isEducationExperience = (e: AnyExperience): e is EducationExperience => e.__typename === "EducationExperience";
export const isPersonalExperience = (e: AnyExperience): e is PersonalExperience => e.__typename === "PersonalExperience";
export const isWorkExperience = (e: AnyExperience): e is WorkExperience => e.__typename === "WorkExperience";
