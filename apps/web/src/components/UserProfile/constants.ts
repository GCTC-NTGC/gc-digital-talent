export const PAGE_SECTION_ID = {
  STATUS: "status-section",
  ABOUT: "about-section",
  DEI: "diversity-equity-inclusion-section",
  LANGUAGE: "language-section",
  GOVERNMENT: "government-section",
  WORK_LOCATION: "work-location-section",
  WORK_PREFERENCES: "work-preferences-section",
  ROLE_AND_SALARY: "role-and-salary-section",
  RESUME_AND_RECRUITMENTS: "resume-and-recruitments-section",
  ACCOUNT_AND_PRIVACY: "account-and-privacy-section",
} as const;

type ObjectValues<T> = T[keyof T];
export type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;
