export const SECTION_KEY = {
  CONTACT: "contact",
  SCREENING: "screening",
  GENERAL: "generalQuestions",
  EDUCATION: "education",
  ESSENTIAL: "essentialSkills",
  ASSET: "assetSkills",
  LANGUAGE: "language",
  WORK_PREF: "workPref",
  GOV_INFO: "govInfo",
  DEI: "dei",
  CITIZEN_VETERAN_PRIORITY: "citizenVeteranPriority",
  SIGNATURE: "signature",
} as const;

export const ALL_SECTIONS = Object.values(SECTION_KEY);

type ObjectValues<T> = T[keyof T];
export type SectionKey = ObjectValues<typeof SECTION_KEY>;
