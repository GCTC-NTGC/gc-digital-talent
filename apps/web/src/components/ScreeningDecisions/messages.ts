import { defineMessage, type PrimitiveType } from "react-intl";

const screeningDialogMessages = {
  customTitle: defineMessage<{
    customTitle: PrimitiveType;
    title: PrimitiveType;
    skillName: PrimitiveType;
  }>({
    defaultMessage: "{customTitle} ({title}) assessment - {skillName}",
    id: "B0OL/n",
    description: "Header for application screening decision dialog.",
  }),
  title: defineMessage<{ title: PrimitiveType; skillName: PrimitiveType }>({
    defaultMessage: "{title} assessment - {skillName}",
    id: "WAcWqh",
    description: "Header for application screening decision dialog.",
  }),
  reviewAndRecord: defineMessage<{
    candidateName: PrimitiveType;
    skillName: PrimitiveType;
  }>({
    defaultMessage: `Review and record {candidateName}'s results on "{skillName}"`,
    id: "cnoxKB",
    description:
      "Subtitle for education requirement screening decision dialog.",
  }),
  reviewRecordSkillLevel: defineMessage<{
    candidateName: PrimitiveType;
    skillName: PrimitiveType;
    skillLevel: PrimitiveType;
  }>({
    defaultMessage: `Review and record {candidateName}'s results on "{skillName}" at the "{skillLevel}" level.`,
    id: "e1mxkv",
    description:
      "Subtitle for education requirement screening decision dialog.",
  }),
  educationTitle: defineMessage({
    defaultMessage: "Assess the candidate's education requirement",
    id: "wCzVDg",
    description: "Header for education requirement screening decision dialog.",
  }),
  educationSubtitle: defineMessage<{ candidateName: PrimitiveType }>({
    defaultMessage:
      "Review and assess {candidateName}'s evidence against the required education or equivalent experience.",
    id: "74Npts",
    description:
      "Subtitle for education requirement screening decision dialog.",
  }),
  appScreeningTitle: defineMessage<{ skillName: PrimitiveType }>({
    defaultMessage: "Application screening - {skillName}",
    id: "gGwbvj",
    description: "Header for application screening decision dialog.",
  }),
  screeningQuestionsTitle: defineMessage<{ skillName: PrimitiveType }>({
    defaultMessage:
      "Screening questions (At the time of application) - {skillName}",
    id: "LF9xdK",
    description: "Header for application screening decision dialog.",
  }),
};

export default screeningDialogMessages;
