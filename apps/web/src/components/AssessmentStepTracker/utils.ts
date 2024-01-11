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
import poolCandidateMessages from "~/messages/poolCandidateMessages";
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
      name: intl.formatMessage(poolCandidateMessages.toAssess),
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

const getBookmarkValue = (result: AssessmentResult & { ordinal?: number }) => {
  return Number(result.poolCandidate?.isBookmarked);
};
const getDecisionValue = (result: AssessmentResult & { ordinal?: number }) => {
  return decisionOrder.indexOf(result.assessmentDecision ?? NO_DECISION);
};
const getPriorityValue = (result: AssessmentResult & { ordinal?: number }) => {
  return Number(result.poolCandidate?.user.hasPriorityEntitlement);
};
const getVeteranValue = (result: AssessmentResult & { ordinal?: number }) => {
  return Number(
    result.poolCandidate?.user.armedForcesStatus === ArmedForcesStatus.Veteran,
  );
};
const compareLastNames = (
  resultA: AssessmentResult & { ordinal?: number },
  resultB: AssessmentResult & { ordinal?: number },
) => {
  const user1Name: string = resultA.poolCandidate?.user.lastName || "";
  const user2Name: string = resultB.poolCandidate?.user.lastName || "";
  return user1Name.localeCompare(user2Name);
};
const compareFirstNames = (
  resultA: AssessmentResult & { ordinal?: number },
  resultB: AssessmentResult & { ordinal?: number },
) => {
  const user1Name: string = resultA.poolCandidate?.user.firstName || "";
  const user2Name: string = resultB.poolCandidate?.user.firstName || "";
  return user1Name.localeCompare(user2Name);
};

/** Adds the ordinal for candidates based on their sort order ignoring bookmarks
 * then resorts them with bookmarking and returns the result
 */
export const sortResultsAndAddOrdinal = (
  results: AssessmentResult[],
): (AssessmentResult & { ordinal: number })[] => {
  // Do the first sort to determine order without bookmarking
  const firstSortResults = results.sort((resultA, resultB) => {
    return (
      getDecisionValue(resultA) - getDecisionValue(resultB) ||
      getPriorityValue(resultB) - getPriorityValue(resultA) ||
      getVeteranValue(resultB) - getVeteranValue(resultA) ||
      compareLastNames(resultA, resultB) ||
      compareFirstNames(resultA, resultB)
    );
  });

  // Iterate through the results adding an ordinal based on index
  const resultsWithOrdinal = firstSortResults.map((result, index) => {
    return {
      ...result,
      ordinal: index + 1,
    };
  });

  // Resort the results - this time using bookmarks as well
  return resultsWithOrdinal.sort((resultA, resultB) => {
    return (
      getBookmarkValue(resultB) - getBookmarkValue(resultA) ||
      getDecisionValue(resultA) - getDecisionValue(resultB) ||
      getPriorityValue(resultB) - getPriorityValue(resultA) ||
      getVeteranValue(resultB) - getVeteranValue(resultA) ||
      compareLastNames(resultA, resultB) ||
      compareFirstNames(resultA, resultB)
    );
  });
};
