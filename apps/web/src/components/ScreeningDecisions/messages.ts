import { defineMessages } from "react-intl";

const screeningDialogMessages = defineMessages({
  customTitle: {
    defaultMessage: "{customTitle} ({title}) assessment - {skillName}",
    id: "B0OL/n",
    description: "Header for application screening decision dialog.",
  },
  title: {
    defaultMessage: "{title} assessment - {skillName}",
    id: "WAcWqh",
    description: "Header for application screening decision dialog.",
  },
  reviewAndRecord: {
    defaultMessage: `Review and record {candidateName}'s results on "{skillName}"`,
    id: "cnoxKB",
    description:
      "Subtitle for education requirement screening decision dialog.",
  },
  reviewRecordSkillLevel: {
    defaultMessage: `Review and record {candidateName}'s results on "{skillName}" at the "{skillLevel}" level.`,
    id: "e1mxkv",
    description:
      "Subtitle for education requirement screening decision dialog.",
  },
  educationTitle: {
    defaultMessage: "Assess the candidate's education requirement",
    id: "wCzVDg",
    description: "Header for education requirement screening decision dialog.",
  },
  educationSubtitle: {
    defaultMessage:
      "Review and assess {candidateName}'s evidence against the required education or equivalent experience.",
    id: "74Npts",
    description:
      "Subtitle for education requirement screening decision dialog.",
  },
  appScreeningTitle: {
    defaultMessage: "Application screening - {skillName}",
    id: "gGwbvj",
    description: "Header for application screening decision dialog.",
  },
  screeningQuestionsTitle: {
    defaultMessage:
      "Screening questions (At the time of application) - {skillName}",
    id: "LF9xdK",
    description: "Header for application screening decision dialog.",
  },
});

export default screeningDialogMessages;
