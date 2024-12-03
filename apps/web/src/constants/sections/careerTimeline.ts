import { defineMessages } from "react-intl";

export const PAGE_SECTION_ID = {
  MANAGE_YOUR_CAREER_TIMELINE: "manage-your-career-timeline",
  QUALIFIED_RECRUITMENT_PROCESSES: "qualified-recruitment-processes",
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
  qualifiedRecruitmentProcesses: {
    defaultMessage: "Qualified recruitment processes",
    id: "d8j/Sr",
    description:
      "Titles for a page section to manage your qualified recruitment processes",
  },
});
