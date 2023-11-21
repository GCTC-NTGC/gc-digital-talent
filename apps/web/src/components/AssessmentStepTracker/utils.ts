import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

import {
  ArmedForcesStatus,
  AssessmentDecision,
  AssessmentResult,
  Maybe,
} from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";

type DecisionInfo = {
  colorStyle: Record<string, string>;
  icon: IconType;
  name: string;
};

export const getDecisionInfo = (
  decision: Maybe<AssessmentDecision>,
  isApplicationStep: boolean,
  intl: IntlShape,
): DecisionInfo => {
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
      name: isApplicationStep
        ? intl.formatMessage({
            defaultMessage: "Screened out",
            id: "3xCX4b",
            description:
              "Message displayed when candidate has been screened out at a specific assessment step",
          })
        : intl.formatMessage({
            defaultMessage: "Successful",
            id: "Whq2Xl",
            description:
              "Message displayed when candidate has successfully passed an assessment step",
          }),
    };
  }

  return {
    icon: CheckCircleIcon,
    colorStyle: {
      "data-h2-color": "base(success)",
    },
    name: isApplicationStep
      ? intl.formatMessage({
          defaultMessage: "Screened in",
          id: "3W/NbE",
          description:
            "Message displayed when candidate has been screened in at a specific assessment step",
        })
      : intl.formatMessage({
          defaultMessage: "Unsuccessful",
          id: "TIAla1",
          description:
            "Message displayed when candidate has not passed an assessment step",
        }),
  };
};

export type ResultDecisionCounts = Record<AssessmentDecision, number>;

export const getResultDecisionCount = (results: AssessmentResult[]) => {
  const stepAccumulation: ResultDecisionCounts = {
    [AssessmentDecision.NotSure]: 0,
    [AssessmentDecision.Successful]: 0,
    [AssessmentDecision.Unsuccessful]: 0,
  };

  return results.reduce(
    (accumulator: ResultDecisionCounts, assessmentResult: AssessmentResult) => {
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
    const decisionA = decisionOrder.indexOf(
      resultA.assessmentDecision ?? AssessmentDecision.NotSure,
    );
    const isPriorityA = Number(
      resultA.poolCandidate?.user.hasPriorityEntitlement,
    );
    const isVetA = Number(
      resultA.poolCandidate?.user.armedForcesStatus ===
        ArmedForcesStatus.Veteran,
    );

    const decisionB = decisionOrder.indexOf(
      resultB.assessmentDecision ?? AssessmentDecision.NotSure,
    );
    const isPriorityB = Number(
      resultB.poolCandidate?.user.hasPriorityEntitlement,
    );
    const isVetB = Number(
      resultB.poolCandidate?.user.armedForcesStatus ===
        ArmedForcesStatus.Veteran,
    );

    return (
      decisionA - decisionB || isPriorityB - isPriorityA || isVetB - isVetA
    );
  });
};
