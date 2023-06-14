import { defineMessages } from "react-intl";

export const PAGE_SECTION_ID = {
  MANAGE_YOUR_RESUME: "manage-your-resume",
  QUALIFIED_RECRUITMENT_PROCESSES: "qualified-recruitment-processes",
} as const;

type ObjectValues<T> = T[keyof T];
export type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;

export const titles = defineMessages({
  resumeAndRecruitments: {
    defaultMessage: "Résumé and recruitments",
    id: "SyJkc/",
    description: "Name of Résumé and recruitments page",
  },
  manageYourResume: {
    defaultMessage: "Manage your résumé",
    id: "amibs2",
    description: "Titles for a page section to manage your résumé",
  },
  qualifiedRecruitmentProcesses: {
    defaultMessage: "Qualified recruitment processes",
    id: "d8j/Sr",
    description:
      "Titles for a page section to manage your qualified recruitment processes",
  },
});
