export const PAGE_SECTION_ID = {
  FunctionalCommunities: "functional-communities",
} as const;

type ObjectValues<T> = T[keyof T];
export type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;
