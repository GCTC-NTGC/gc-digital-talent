export const PAGE_SECTION_ID = {
  ABOUT: "about-section",
  DEI: "diversity-equity-inclusion-section",
  LANGUAGE: "language-section",
  GOVERNMENT: "government-section",
  WORK_LOCATION: "work-location-section",
  WORK_PREFERENCES: "work-preferences-section",
  CAREER_TIMELINE_AND_RECRUITMENT: "career-timeline-section",
  SKILL_SHOWCASE: "skill-showcase",
  ACCOUNT_AND_PRIVACY: "account-and-privacy-section",
} as const;

type ObjectValues<T> = T[keyof T];
export type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;
