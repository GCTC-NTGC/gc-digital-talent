export const PAGE_SECTION_ID = {
  CAREER_EXPERIENCE: "career-experience-section",
} as const;

type ObjectValues<T> = T[keyof T];
export type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;
