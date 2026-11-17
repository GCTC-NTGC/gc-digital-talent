export const PAGE_SECTION_ID = {
  CAREER_EXPERIENCE: "career-experience-section",
  WORK_EXPERIENCE: "work-experience-section",
  AWARD_EXPERIENCE: "award-experience-section",
  EDUCATION_EXPERIENCE: "education-experience-section",
  COMMUNITY_EXPERIENCE: "community-experience-section",
  PERSONAL_EXPERIENCE: "personal-experience-section",
  TIMELINE: "timeline-section",
} as const;

type ObjectValues<T> = T[keyof T];
export type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;
