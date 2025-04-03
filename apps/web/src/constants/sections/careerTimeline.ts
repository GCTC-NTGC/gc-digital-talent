import { defineMessages } from "react-intl";

export const PAGE_SECTION_ID = {
  MANAGE_YOUR_CAREER_TIMELINE: "manage-your-career-timeline",
} as const;

type ObjectValues<T> = T[keyof T];
export type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;

export const titles = defineMessages({
  careerTimelineAndRecruitment: {
    defaultMessage: "Career timeline",
    id: "TUfJUD",
    description: "Name of Career timeline page",
  },
  manageYourCareerTimeline: {
    defaultMessage: "Manage your career timeline",
    id: "eZYP/W",
    description: "Titles for a page section to manage your career timeline",
  },
});
