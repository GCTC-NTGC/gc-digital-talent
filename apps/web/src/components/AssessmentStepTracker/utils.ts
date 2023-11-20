import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

import {
  AssessmentDecision,
  AssessmentResult,
  AssessmentStep,
  PoolCandidate,
} from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";

export type CandidatesByStep = {
  step: AssessmentStep;
  candidates: PoolCandidate[];
};

export type ResultStatus = "toAssess" | "success" | "failure";

type ResultStatusInfo = {
  colorStyle: Record<string, string>;
  icon: IconType;
  name: string;
};

export const getResultStatusInfo = (
  status: ResultStatus,
  intl: IntlShape,
): ResultStatusInfo => {
  if (status === "failure") {
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
  if (status === "success") {
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
  }

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
};

export type ResultStatusCounts = Record<ResultStatus, number>;

export const getResultStatusCount = (results: AssessmentResult[]) => {
  const stepAccumulation: ResultStatusCounts = {
    toAssess: 0,
    success: 0,
    failure: 0,
  };

  return results.reduce(
    (accumulator: ResultStatusCounts, assessmentResult: AssessmentResult) => {
      if (
        assessmentResult?.assessmentDecision === AssessmentDecision.Successful
      ) {
        return {
          ...accumulator,
          success: accumulator.success + 1,
        };
      }

      if (
        assessmentResult?.assessmentDecision === AssessmentDecision.Unsuccessful
      ) {
        return {
          ...accumulator,
          failure: accumulator.success + 1,
        };
      }

      return {
        ...accumulator,
        toAssess: accumulator.toAssess + 1,
      };
    },
    stepAccumulation,
  );
};
