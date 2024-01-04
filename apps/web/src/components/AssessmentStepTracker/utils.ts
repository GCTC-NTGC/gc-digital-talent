import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";

import { IconType } from "@gc-digital-talent/ui";

import {
  ArmedForcesStatus,
  AssessmentDecision,
  AssessmentResult,
  Maybe,
} from "~/api/generated";
import { NO_DECISION, NullableDecision } from "~/utils/assessmentResults";

type DecisionInfo = {
  colorStyle: Record<string, string>;
  icon: IconType;
  name: string;
};

export const getDecisionInfo = (
  decision: Maybe<NullableDecision> | undefined,
  isApplicationStep: boolean,
  intl: IntlShape,
): DecisionInfo => {
  if (!decision || decision === NO_DECISION) {
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

  if (decision === AssessmentDecision.Hold) {
    return {
      icon: PauseCircleIcon,
      colorStyle: {
        "data-h2-color": "base(warning)",
      },
      name: intl.formatMessage({
        defaultMessage: "On hold",
        id: "qA8+f5",
        description:
          "Message displayed when candidate was unsuccessful but put on hold",
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
            defaultMessage: "Unsuccessful",
            id: "TIAla1",
            description:
              "Message displayed when candidate has not passed an assessment step",
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
          defaultMessage: "Successful",
          id: "Whq2Xl",
          description:
            "Message displayed when candidate has successfully passed an assessment step",
        }),
  };
};

export type ResultDecisionCounts = Record<NullableDecision, number>;

export const getResultDecisionCount = (results: AssessmentResult[]) => {
  const stepAccumulation: ResultDecisionCounts = {
    noDecision: 0,
    [AssessmentDecision.Hold]: 0,
    [AssessmentDecision.Successful]: 0,
    [AssessmentDecision.Unsuccessful]: 0,
  };

  return results.reduce(
    (accumulator: ResultDecisionCounts, assessmentResult: AssessmentResult) => {
      const decision: NullableDecision =
        assessmentResult.assessmentDecision ?? NO_DECISION;
      return {
        ...accumulator,
        [decision]: accumulator[decision] + 1,
      };
    },
    stepAccumulation,
  );
};

export const decisionOrder: NullableDecision[] = [
  NO_DECISION,
  AssessmentDecision.Successful,
  AssessmentDecision.Hold,
  AssessmentDecision.Unsuccessful,
];

export const sortResults = (
  results: AssessmentResult[],
): AssessmentResult[] => {
  return results.sort((resultA, resultB) => {
    const decisionA = decisionOrder.indexOf(
      resultA.assessmentDecision ?? NO_DECISION,
    );
    const isPriorityA = Number(
      resultA.poolCandidate?.user.hasPriorityEntitlement,
    );
    const isVetA = Number(
      resultA.poolCandidate?.user.armedForcesStatus ===
        ArmedForcesStatus.Veteran,
    );

    const decisionB = decisionOrder.indexOf(
      resultB.assessmentDecision ?? NO_DECISION,
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
