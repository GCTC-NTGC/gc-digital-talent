import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

import {
  AssessmentDecision,
  AssessmentResult,
  Maybe,
} from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";

type ResultStatusInfo = {
  colorStyle: Record<string, string>;
  icon: IconType;
  name: string;
};

export const getResultStatusInfo = (
  decision: Maybe<AssessmentDecision>,
  intl: IntlShape,
): ResultStatusInfo => {
  if (!decision || decision === AssessmentDecision.NotSure) {
    return {
      icon: ExclamationCircleIcon,
      colorStyle: {
        "data-h2-color": "base(warning)",
      },
      name: intl.formatMessage({
        defaultMessage: "To assess",
        id: "/+naWC",
        description:
          "Message displayed when candidate has yet to be assessed at a specific assessment step",
      }),
    };
  }

  if (decision === AssessmentDecision.Unsuccessful) {
    return {
      icon: XCircleIcon,
      colorStyle: {
        "data-h2-color": "base(error)",
      },
      name: intl.formatMessage({
        defaultMessage: "Screened out",
        id: "3xCX4b",
        description:
          "Message displayed when candidate has been screened out at a specific assessment step",
      }),
    };
  }

  return {
    icon: CheckCircleIcon,
    colorStyle: {
      "data-h2-color": "base(success)",
    },
    name: intl.formatMessage({
      defaultMessage: "Screened in",
      id: "3W/NbE",
      description:
        "Message displayed when candidate has been screened in at a specific assessment step",
    }),
  };
};

export type ResultStatusCounts = Record<AssessmentDecision, number>;

export const getResultStatusCount = (results: AssessmentResult[]) => {
  const stepAccumulation: ResultStatusCounts = {
    [AssessmentDecision.NotSure]: 0,
    [AssessmentDecision.Successful]: 0,
    [AssessmentDecision.Unsuccessful]: 0,
  };

  return results.reduce(
    (accumulator: ResultStatusCounts, assessmentResult: AssessmentResult) => {
      const decision: AssessmentDecision =
        assessmentResult.assessmentDecision ?? AssessmentDecision.NotSure;
      return {
        ...accumulator,
        [decision]: accumulator[decision] + 1,
      };
    },
    stepAccumulation,
  );
};

export const decisionOrder: AssessmentDecision[] = [
  AssessmentDecision.NotSure,
  AssessmentDecision.Successful,
  AssessmentDecision.Unsuccessful,
];

export const sortResults = (
  results: AssessmentResult[],
): AssessmentResult[] => {
  return results.sort((resultA, resultB) => {
    return (
      decisionOrder.indexOf(
        resultA.assessmentDecision ?? AssessmentDecision.NotSure,
      ) -
      decisionOrder.indexOf(
        resultB.assessmentDecision ?? AssessmentDecision.NotSure,
      )
    );
  });
};
