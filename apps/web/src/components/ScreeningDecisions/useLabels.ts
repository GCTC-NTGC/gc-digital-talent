import { IntlShape, useIntl } from "react-intl";

import { FieldLabels } from "@gc-digital-talent/forms";

const getLabels = (intl: IntlShape) => {
  return {
    assessmentDecision: intl.formatMessage({
      defaultMessage: "Requirement decision",
      id: "mGQUWc",
      description:
        "Label for requirement decision radio group in the screening decision dialog.",
    }),
    justification: intl.formatMessage({
      defaultMessage: "Justification",
      id: "Yy+JXc",
      description:
        "Label for justification radio group in the screening decision dialog.",
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
    assessmentNotes: intl.formatMessage({
      defaultMessage: "Notes for this assessment",
      id: "vHDpXX",
      description:
        "Label for generic notes text area in the screening decision dialog.",
    }),
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
