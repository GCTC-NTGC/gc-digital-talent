import { defineMessage, type PrimitiveType } from "react-intl";

const messages = {
  addNewExperience: defineMessage({
    defaultMessage: "Add a new experience",
    id: "bOAF9o",
    description: "Button to open modal to add a new experience to the profile",
  }),
  award: defineMessage({
    defaultMessage: "Awards and recognition",
    id: "DRYl88",
    description: "Title for award experience section",
  }),
  awardDescription: defineMessage({
    defaultMessage:
      "Awards and recognition include specific awards and recognition you’ve received for going above and beyond.",
    id: "xQSZ+V",
    description: "Description for award experience card header",
  }),
  addAward: defineMessage({
    defaultMessage: "Add an award or recognition",
    id: "tj7eTS",
    description:
      "Link text to add an award experience on experience card header",
  }),
  community: defineMessage({
    defaultMessage: "Community participation",
    id: "Uy5Dg2",
    description: "Title for community experience section",
  }),
  communityDescription: defineMessage({
    defaultMessage:
      "Community experience is the place to share how participating in your community has helped you grow, including volunteering, ceremony, events, and virtual collaboration.",
    id: "bLaMGb",
    description: "Description for community experience card header",
  }),
  addCommunity: defineMessage({
    defaultMessage: "Add a community participation",
    id: "N6jHMK",
    description:
      "Link text to add a community experience on experience card header",
  }),
  education: defineMessage({
    defaultMessage: "Education and certificates",
    id: "PFoM2I",
    description: "Title for education experience section",
  }),
  educationDescription: defineMessage({
    defaultMessage:
      "Education experience allows you to share your diplomas, certificates, online courses, apprenticeships, licenses, or alternative credentials received from educational institutions.",
    id: "XbsYGW",
    description: "Description for education experience card header",
  }),
  addEducation: defineMessage({
    defaultMessage: "Add education or a certificate",
    id: "dB4fUm",
    description:
      "Link text to add a education experience on experience card header",
  }),
  personal: defineMessage({
    defaultMessage: "Personal learning",
    id: "+AUFyC",
    description: "Title for personal learning section",
  }),
  personalDescription: defineMessage({
    defaultMessage:
      "Personal learning experience can be used to share how other life events have helped you grow and develop your skills, including family, hobbies, and extracurriculars.",
    id: "8i3Ec8",
    description: "Description for personal experience card header",
  }),
  addPersonal: defineMessage({
    defaultMessage: "Add personal experience or a certificate",
    id: "lNrsD+",
    description:
      "Link text to add a personal experience on experience card header",
  }),
  work: defineMessage({
    defaultMessage: "Work experience",
    id: "giUfys",
    description: "Title for work experience section",
  }),
  workDescription: defineMessage({
    defaultMessage:
      "Work experience is a great place to share your part-time, full-time, self-employment, non-profit, or internship experiences.",
    id: "yBpua7",
    description: "Description for work experience card header",
  }),
  addWork: defineMessage({
    defaultMessage: "Add work experience",
    id: "tD+jQR",
    description: "Link text to add a work experience on experience card header",
  }),
  unknown: defineMessage({
    defaultMessage: "Unknown Experience",
    id: "U/Lv8i",
    description: "Title for unknown experiences",
  }),
  communityAt: defineMessage<{
    title: PrimitiveType;
    organization: PrimitiveType;
  }>({
    defaultMessage: "{title} at {organization}",
    id: "vV0SDz",
    description: "Title at organization",
  }),
  communityAtHtml: defineMessage<{
    title: PrimitiveType;
    organization: PrimitiveType;
  }>({
    defaultMessage: "<strong>{title}</strong> at {organization}",
    id: "IFKgSr",
    description: "Title at organization, HTML",
  }),
  educationAt: defineMessage<{
    educationType: PrimitiveType;
    areaOfStudy: PrimitiveType;
    institution: PrimitiveType;
  }>({
    defaultMessage: "{educationType} in {areaOfStudy} from {institution}",
    id: "z9erMM",
    description: "Study at institution",
  }),
  educationAtHtml: defineMessage<{
    educationType: PrimitiveType;
    areaOfStudy: PrimitiveType;
    institution: PrimitiveType;
  }>({
    defaultMessage:
      "<strong>{educationType}</strong> in <strong>{areaOfStudy}</strong> from {institution}",
    id: "ymTeAQ",
    description: "Study at institution, HTML",
  }),
  educationAtWithoutType: defineMessage<{
    areaOfStudy: PrimitiveType;
    institution: PrimitiveType;
  }>({
    defaultMessage: "{areaOfStudy} from {institution}",
    id: "WyxGlF",
    description: "Study at institution without type",
  }),
  educationAtWithoutTypeHtml: defineMessage<{
    areaOfStudy: PrimitiveType;
    institution: PrimitiveType;
  }>({
    defaultMessage: "<strong>{areaOfStudy}</strong> from {institution}",
    id: "dy98XL",
    description: "Study at institution without type, HTML",
  }),
  educationAtWithoutSubject: defineMessage<{
    educationType: PrimitiveType;
    institution: PrimitiveType;
  }>({
    defaultMessage: "{educationType} from {institution}",
    id: "hiESrI",
    description: "Study at institution",
  }),
  educationAtWithoutSubjectHtml: defineMessage<{
    educationType: PrimitiveType;
    institution: PrimitiveType;
  }>({
    defaultMessage: "<strong>{educationType}</strong> from {institution}",
    id: "SWtxLc",
    description: "Study at institution, HTML",
  }),
  workAt: defineMessage<{ role: PrimitiveType; organization: PrimitiveType }>({
    defaultMessage: "{role} at {organization}",
    id: "wTAdQe",
    description: "Role at organization",
  }),
  workAtHtml: defineMessage<{
    role: PrimitiveType;
    organization: PrimitiveType;
  }>({
    defaultMessage: "<strong>{role}</strong> at {organization}",
    id: "lhV7kM",
    description: "Role at organization, HTML",
  }),
  workWith: defineMessage<{ role: PrimitiveType; group: PrimitiveType }>({
    defaultMessage: "{role} with {group}",
    id: "1b+6V1",
    description: "Role with group",
  }),
  workWithHtml: defineMessage<{ role: PrimitiveType; group: PrimitiveType }>({
    defaultMessage: "<strong>{role}</strong> with {group}",
    id: "1syFdp",
    description: "Role with group, HTML",
  }),
  collapseDetails: defineMessage({
    defaultMessage: "Collapse all<hidden> experience details</hidden>",
    id: "pp+b1H",
    description: "Button label to collapse all experiences",
  }),
  expandDetails: defineMessage({
    defaultMessage: "Expand all<hidden> experience details</hidden>",
    id: "M1en14",
    description: "Button label to expand all experiences",
  }),
  roleActing: defineMessage({
    defaultMessage: "Acting role",
    id: "ow3hcA",
    description: "Label for Government position type acting",
  }),
  roleAssignment: defineMessage({
    defaultMessage: "Assignment role",
    id: "tb4mS6",
    description: "Label for Government position type assignment",
  }),
  roleSecondment: defineMessage({
    defaultMessage: "Secondment role",
    id: "rXd18V",
    description: "Label for Government position type secondment",
  }),
  roleSubstantive: defineMessage({
    defaultMessage: "Substantive role",
    id: "hqCFJg",
    description: "Label for Government position type substantive",
  }),
  dateRangeMissingEndDate: defineMessage<{ startDate: PrimitiveType }>({
    defaultMessage: "{startDate} - <red>Missing end date</red>",
    id: "NMo1VF",
    description: "Experience date range when end date is missing",
  }),
  dates: defineMessage({
    defaultMessage: "Dates",
    id: "Bs00Yf",
    description: "Heading for the date range of an experience",
  }),
  duration: defineMessage({
    defaultMessage: "Duration",
    id: "X3puDA",
    description: "Heading for how long an experience lasted",
  }),
};

export default messages;
