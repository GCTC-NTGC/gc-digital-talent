import { defineMessage, type PrimitiveType } from "react-intl";

const labels = {
  typeOfAssessment: defineMessage({
    defaultMessage: "Type of assessment",
    id: "3/AA3n",
    description:
      "Label for 'Type of assessment' input on the assessment details dialog",
  }),
  assessmentTitle: defineMessage({
    defaultMessage: "Assessment title",
    id: "G9oyzn",
    description:
      "Label for assessment title input on the assessment details dialog",
  }),
  screeningQuestion: defineMessage<{ questionNumber: PrimitiveType }>({
    defaultMessage: "Question {questionNumber}",
    id: "y4JZuf",
    description:
      "Label for screening question input on the assessment details dialog",
  }),
  essentialSkills: defineMessage({
    defaultMessage: "Essential skills",
    id: "FKfj8D",
    description:
      "Label for 'essential skills' input on the assessment details dialog",
  }),
  assetSkills: defineMessage({
    defaultMessage: "Asset skills",
    id: "4RE3DP",
    description:
      "Label for 'asset skills' input on the assessment details dialog",
  }),
};

export default labels;
