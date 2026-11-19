import { defineMessage, type PrimitiveType } from "react-intl";

const messages = {
  supervisoryPositionYes: defineMessage({
    defaultMessage: "Yes, this is a supervisory position",
    id: "mrMxsI",
    description:
      "Checkbox selection that confirms a job opportunity will have supervising duties. ",
  }),
  supervisoryPositionNo: defineMessage({
    defaultMessage: "No, this will not be a supervisory position",
    id: "nYEPMG",
    description:
      "Checkbox selection that confirms a job opportunity will not have supervising duties. ",
  }),
  additionalComments: defineMessage({
    defaultMessage: "Additional comments",
    id: "GF8FPy",
    description: "Title for the additional comments block for a search request",
  }),
  employmentDuration: defineMessage({
    defaultMessage: "Employment duration",
    description: "Title for Employment duration section",
    id: "Muh/+P",
  }),
  conditionsOfEmployment: defineMessage({
    defaultMessage: "Conditions of employment",
    id: "bKvvaI",
    description: "Legend for the Conditions of Employment filter checklist",
  }),
  requestPurpose: defineMessage({
    defaultMessage: "Request purpose",
    id: "eWVgyx",
    description: "Talent request - request purpose title",
  }),
  classification: defineMessage({
    defaultMessage: "Classification",
    id: "YmWKlv",
    description: "Label for a process' classification",
  }),
  jobTitle: defineMessage({
    defaultMessage: "Job title",
    id: "HBuWZ0",
    description: "Title for job title for a position",
  }),
  workStream: defineMessage({
    defaultMessage: "Work stream",
    id: "UKw7sB",
    description: "Label displayed on the pool form stream/job title field.",
  }),
  languageProfile: defineMessage({
    defaultMessage: "Language profile",
    id: "Ji2C9w",
    description: "Title of the Language Information link section",
  }),
  workingLanguageAbility: defineMessage({
    defaultMessage: "Working language ability",
    id: "FmkNkA",
    description: "Title of the talent request language criteria",
  }),
  supervisoryStatus: defineMessage({
    defaultMessage: "Supervisory status",
    id: "uR9G1H",
    description: "Talent request - supervisory status title",
  }),
  educationRequirement: defineMessage({
    defaultMessage: "Education requirement",
    id: "LyUTqa",
    description: "Education requirement title",
  }),
  equityGroups: defineMessage({
    defaultMessage: "Employment equity groups",
    id: "m3qn9l",
    description: "Legend for the employment equity checklist",
  }),
  workLocation: defineMessage({
    defaultMessage: "Flexible work location options",
    id: "j8R/Mg",
    description:
      "Title for flexible work location options section on summary of filters section",
  }),
  stream: defineMessage({
    defaultMessage: "Work stream",
    id: "EJV1DF",
    description: "Label for a process work stream",
  }),
  community: defineMessage({
    defaultMessage: "Community",
    id: "LOjdrP",
    description: "Title for community",
  }),
  hrAdvisorEmail: defineMessage({
    defaultMessage: "HR advisor email",
    id: "VrLfLw",
    description: "Input label asking for the HR advisor's email address.",
  }),
  followUpDate: defineMessage({
    defaultMessage: "Follow-up date",
    id: "5wS5V8",
    description: "Label for the follow-up date field",
  }),
  candidateTracking: defineMessage({
    defaultMessage: "Candidate tracking",
    id: "4uFJb+",
    description: "Title for tracking candidates within a talent request",
  }),
  onSiteLocations: defineMessage({
    defaultMessage: "On-site locations",
    id: "ngoGPH",
    description: "Label for the talent requests on-site location criteria",
  }),
  trackedUsersNullTitle: defineMessage({
    defaultMessage: "You are not tracking any candidates yet",
    id: "uQqsKm",
    description:
      "Title displayed when there are no tracked users for a talent request",
  }),
  trackedUsersNullDescription: defineMessage({
    defaultMessage:
      "Use the ‘<italic>Find matching candidates</italic>’ table to start tracking possible matching candidates to this request.",
    id: "nmXd3e",
    description:
      "Help message displayed when there are no tracked users for a talent request",
  }),
  requestedSkills: defineMessage({
    defaultMessage: "Requested skills",
    id: "aNhUkJ",
    description:
      "Header for the number of user skills matching requested skills",
  }),
  markAs: defineMessage<{ status: PrimitiveType }>({
    defaultMessage: "Mark as {status}",
    id: "BYi3Ah",
    description:
      "Label for the change status action in the talent request tracked users table",
  }),
  markAllAs: defineMessage<{ status: PrimitiveType }>({
    defaultMessage: "Mark all as {status}",
    id: "LG/8JQ",
    description:
      "Label for the bulk change status action affecting every tracked user in the talent request tracked users inbox",
  }),
  referred: defineMessage({
    defaultMessage: "Referred",
    id: "ZAHz5C",
    description: "Status for referred candidates",
  }),
  updateSuccess: defineMessage({
    defaultMessage: "Tracked users updated successfully.",
    id: "p6y+4U",
    description:
      "Toast shown when a tracked-user bulk status change succeeds in the inbox",
  }),
  updateError: defineMessage({
    defaultMessage: "Error: failed to update tracked users.",
    id: "Us+OYQ",
    description:
      "Toast shown when a tracked-user bulk status change fails in the inbox",
  }),
  sourceOfTalent: defineMessage({
    defaultMessage: "Source of talent",
    id: "qy4Ohw",
    description: "Heading for the source of the matching user.",
  }),
  talentSource: defineMessage({
    defaultMessage: "Talent source",
    id: "5bRS8b",
    description: "Label for the talent source(s) selected on a talent request.",
  }),
};

export default messages;
