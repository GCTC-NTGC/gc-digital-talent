import { defineMessages } from "react-intl";

import adminMessages from "~/messages/adminMessages";
import processMessages from "~/messages/processMessages";

export const pageMessages = defineMessages({
  pageTitle: {
    defaultMessage: "Manager dashboard",
    id: "Q914Cl",
    description: "Title for the 'Manager dashboard' page",
  },
  subTitle: {
    defaultMessage:
      "Manage your talent requests and curate your manager profile.",
    id: "Gw0uTQ",
    description: "Subtitle for the 'Manager dashboard' page",
  },
});

export const talentRequestMessages = defineMessages({
  requestPurpose: {
    defaultMessage: "Request purpose",
    id: "eWVgyx",
    description: "Talent request - request purpose title",
  },
  classification: processMessages.classification,
  jobTitle: adminMessages.jobTitle,
  workStream: {
    defaultMessage: "Work stream",
    id: "UKw7sB",
    description: "Label displayed on the pool form stream/job title field.",
  },
  languageProfile: {
    defaultMessage: "Language profile",
    id: "Ji2C9w",
    description: "Title of the Language Information link section",
  },
  supervisoryStatus: {
    defaultMessage: "Supervisory status",
    id: "uR9G1H",
    description: "Talent request - supervisory status title",
  },
  employmentDuration: {
    defaultMessage: "Employment duration",
    description: "Title for Employment duration section",
    id: "Muh/+P",
  },
  educationRequirement: processMessages.educationRequirement,
  skillRequirements: {
    defaultMessage: "Skill requirements",
    id: "h2h7Df",
    description: "Title for the skills section of a pool advertisement",
  },
  equityGroups: {
    defaultMessage: "Employment equity groups",
    id: "m3qn9l",
    description: "Legend for the employment equity checklist",
  },
  workLocation: {
    defaultMessage: "Work location",
    id: "3e965x",
    description:
      "Title for work location section on summary of filters section",
  },
  conditionsOfEmployment: {
    defaultMessage: "Conditions of employment",
    id: "bKvvaI",
    description: "Legend for the Conditions of Employment filter checklist",
  },
  additionalComments: {
    defaultMessage: "Additional comments",
    id: "GF8FPy",
    description: "Title for the additional comments block for a search request",
  },
});
