import { defineMessages } from "react-intl";

const messages = defineMessages({
  saveContinue: {
    defaultMessage: "Save and continue",
    id: "KZk48E",
    description:
      "Button text to save an application step and continue to the next one",
  },
  saveQuit: {
    defaultMessage: "Save and quit for now",
    id: "U86N4g",
    description: "Action button to save and exit an application",
  },
  numberedStep: {
    defaultMessage: "Step {stepOrdinal}",
    id: "a2ymC3",
    description: "Breadcrumb link text for a numbered application step",
  },
  numberedStepIntro: {
    defaultMessage: "Step {stepOrdinal} (Intro)",
    id: "h8BHov",
    description:
      "Breadcrumb link text for a numbered application step introduction page",
  },
  reservedForIndigenous: {
    defaultMessage:
      "This opportunity is intended for Indigenous candidates only.",
    id: "/fvZtZ",
    description:
      "Error message displayed when a user's equity information does not match an opportunity",
  },
  postSecondaryEducation: {
    defaultMessage:
      "Graduation from a program of 2 years or more offered by a <link>recognized post-secondary institution</link>. The program must have a specialization in computer science, information technology, information management or another specialty relevant to this advertisement.",
    id: "tJLZYs",
    description:
      "Descriptive text explaining a valid post secondary education.",
  },
  appliedWorkExperience: {
    defaultMessage:
      "Combined experience in computer science, information technology information management or another specialty relevant to this advertisement, including any of the following:",
    id: "TEVNs4",
    description: "Descriptive text explaining valid applied work experiences.",
  },
  onTheJobLearning: {
    defaultMessage: "On-the-job learning",
    id: "2FBdeQ",
    description: "Experience requirement, On the job.",
  },
  nonConventionalTraining: {
    defaultMessage: "Non-conventional training",
    id: "bW4lM0",
    description: "Experience requirement, non-conventional training.",
  },
  formalEducation: {
    defaultMessage: "Formal education",
    id: "LWtWs1",
    description: "Experience requirement, formal education.",
  },
  otherExperience: {
    defaultMessage: "Other field related experience",
    id: "oIRkby",
    description: "Experience requirement, other.",
  },
});

export default messages;
