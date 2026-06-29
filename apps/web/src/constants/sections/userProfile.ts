export const PAGE_SECTION_ID = {
  DEI: "diversity-equity-inclusion-section",
  LANGUAGE: "language-section",
  WORK_PREFERENCES: "work-preferences-section",
  CAREER_TIMELINE_AND_RECRUITMENT: "career-timeline-section",
  SKILL_SHOWCASE: "skill-showcase",
  CITIZEN_VETERAN_PRIORITY: "citizen-veteran-priority",
} as const;

type ObjectValues<T> = T[keyof T];
export type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;
