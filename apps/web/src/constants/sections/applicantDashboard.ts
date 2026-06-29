export const PAGE_SECTION_ID = {
  FUNCTIONAL_COMMUNITIES: "functional-communities",
} as const;

type ObjectValues<T> = T[keyof T];
export type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;
