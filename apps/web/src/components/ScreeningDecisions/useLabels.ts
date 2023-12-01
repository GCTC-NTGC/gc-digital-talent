import { IntlShape, useIntl } from "react-intl";

import { FieldLabels } from "@gc-digital-talent/forms";

const getLabels = (intl: IntlShape) => {
  return {
    // Requirement decision section
    assessmentDecision: intl.formatMessage({
      defaultMessage: "Requirement decision",
      id: "mGQUWc",
      description:
        "Label for requirement decision radio group in the screening decision dialog.",
    }),
    notSure: intl.formatMessage({
      defaultMessage: "Not sure",
      id: "x6Wwlc",
      description:
        "Label for requirement decision radio option in the screening decision dialog.",
    }),
    demonstrated: intl.formatMessage({
      defaultMessage: "Demonstrated",
      id: "7ttyl4",
      description:
        "Label for requirement decision radio option in the screening decision dialog.",
    }),
    notDemonstrated: intl.formatMessage({
      defaultMessage: "Not demonstrated",
      id: "AEOon6",
      description:
        "Label for requirement decision radio option in the screening decision dialog.",
    }),

    // Justification demonstrated section
    justification: intl.formatMessage({
      defaultMessage: "Justification",
      id: "Yy+JXc",
      description:
        "Label for justification radio group in the screening decision dialog.",
    }),
    // Justification section -> demonstrated labels
    accepted: intl.formatMessage({
      defaultMessage: "Education information is accepted",
      id: "3Jn67B",
      description:
        "Label for justification radio option in the screening decision dialog.",
    }),
    educationAndExperience: intl.formatMessage({
      defaultMessage:
        "Combination of education and work experience equivalency is accepted",
      id: "DW9cIX",
      description:
        "Label for justification radio option in the screening decision dialog.",
    }),
    workExperience: intl.formatMessage({
      defaultMessage: "Work experience equivalency is accepted",
      id: "g1sb+h",
      description:
        "Label for justification radio option in the screening decision dialog.",
    }),
    // Justification section -> failed labels
    notRelevant: intl.formatMessage({
      defaultMessage: "Not the right field or specialization.",
      id: "skIEGd",
      description:
        "Label for justification radio option in the screening decision dialog.",
    }),
    requirementNotMet: intl.formatMessage({
      defaultMessage:
        "Not enough education or experience to meet the requirement.",
      id: "7b9xa2",
      description:
        "Label for justification radio option in the screening decision dialog.",
    }),
    notEnoughInfo: intl.formatMessage({
      defaultMessage: "Not enough information provided.",
      id: "Ic5L30",
      description:
        "Label for justification radio option in the screening decision dialog.",
    }),

    assessmentDecisionLevel: intl.formatMessage({
      defaultMessage: "Demonstrated level",
      id: "WKAzau",
      description:
        "Label for demonstrated level radio group in the screening decision dialog.",
    }),
    decisionNotes: intl.formatMessage({
      defaultMessage: "Decision notes",
      id: "9fEw/Y",
      description:
        "Label for demonstrated notes text area in the screening decision dialog.",
    }),
    notesForThisAssessment: intl.formatMessage({
      defaultMessage: "Notes for this assessment",
      id: "vHDpXX",
      description:
        "Label for generic notes text area in the screening decision dialog.",
    }),

    // Other stuff
    failedOther: intl.formatMessage({
      defaultMessage: "Other reason for screening out.",
      id: "C5uhBP",
      description: "Label for radio option in the screening decision dialog.",
    }),
    other: intl.formatMessage({
      defaultMessage: "Other reason",
      id: "HtjPHW",
      description:
        "Label for other reason text area in the screening decision dialog.",
    }),
  } as const;
};

const useLabels = () => {
  const intl = useIntl();
  const labels = getLabels(intl) satisfies FieldLabels;
  return labels;
};

export default useLabels;
