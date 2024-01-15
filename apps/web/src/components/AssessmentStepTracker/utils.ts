import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import omit from "lodash/omit";

import { IconType } from "@gc-digital-talent/ui";
import {
  PoolCandidate,
  ArmedForcesStatus,
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultType,
  Maybe,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

import { NO_DECISION, NullableDecision } from "~/utils/assessmentResults";

export type CandidateAssessmentResult = {
  poolCandidate: PoolCandidate;
  decision: NullableDecision;
  results: AssessmentResult[];
};

/**
 * Derives the current decision of all assessments
 * results for a specific set (attributed to a candidate)
 *
 * NOTE:
 *
 * Essential requirements = essential skills AND education requirements
 * Optional requirements = asset skills
 * Assessment Step Status =
 *  IF any essential requirements unsuccessful THEN "unsuccessful"
 *  IF any requirements unassessed THEN "to assess"
 *  IF essential requirements include at least one hold THEN "hold"
 *  IF all essential requirements successful THEN "success"
 *
 * @param results
 * @returns NullableDecision
 */
const deriveResultsDecision = (
  results: AssessmentResult[],
): NullableDecision => {
  // Determine what results are deemed "essential" (essential skills or education requirement)
  const essentialAssessments = results.filter((result) => {
    const containsEssentialSkill =
      result.poolSkill?.type === PoolSkillType.Essential;
    return (
      containsEssentialSkill ||
      result.assessmentResultType === AssessmentResultType.Education
    );
  });

  const essentialWasUnsuccessful = !!essentialAssessments.find(
    (result) => result.assessmentDecision === AssessmentDecision.Unsuccessful,
  );
  if (essentialWasUnsuccessful) return AssessmentDecision.Unsuccessful;

  const containsOnHold = !!essentialAssessments.find(
    (result) => result.assessmentDecision === AssessmentDecision.Hold,
  );
  if (containsOnHold) return AssessmentDecision.Hold;

  const containsToAssess = !!results.find(
    (result) => result.assessmentDecision === null,
  );
  if (containsToAssess) return NO_DECISION;

  const essentialWasSuccessful = essentialAssessments.every(
    (result) => result.assessmentDecision === AssessmentDecision.Successful,
  );
  if (essentialWasSuccessful) return AssessmentDecision.Successful;

  return NO_DECISION;
};

type CandidateAssessmentResultNoDecision = Omit<
  CandidateAssessmentResult,
  "decision"
>;

/**
 * Given a set of results, group them by candidate
 * deriving the overall decision from all results
 * for a specific candidate
 *
 * @param results
 * @returns CandidateAssessmentResult[]
 */
export const groupResultsByCandidate = (
  results: AssessmentResult[],
): CandidateAssessmentResult[] => {
  const groupedAssessments = results.reduce<
    CandidateAssessmentResultNoDecision[]
  >(
    (
      candidateResults: CandidateAssessmentResultNoDecision[],
      currentResult: AssessmentResult,
    ) => {
      if (!currentResult.poolCandidate?.id) return candidateResults;
      const candidateIndex = candidateResults.findIndex(
        (candidateResult) =>
          candidateResult.poolCandidate.id === currentResult.poolCandidate?.id,
      );

      // We store the candidate separate so not needed here
      const strippedResult = omit(currentResult, "poolCandidate");

      // Candidate does not exist in array so add it
      if (candidateIndex === -1) {
        return [
          ...candidateResults,
          {
            poolCandidate: currentResult.poolCandidate,
            results: [strippedResult],
          },
        ];
      }

      const foundCandidate = candidateResults[candidateIndex];
      return [
        ...candidateResults.slice(0, candidateIndex),
        {
          ...foundCandidate,
          results: [...foundCandidate.results, strippedResult],
        },
        ...candidateResults.slice(candidateIndex + 1),
      ];
    },
    [] as CandidateAssessmentResultNoDecision[],
  );

  return groupedAssessments.map((assessment) => ({
    ...assessment,
    decision: deriveResultsDecision(assessment.results),
  }));
};

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

export const getResultDecisionCount = (
  results: CandidateAssessmentResult[],
) => {
  const stepAccumulation: ResultDecisionCounts = {
    noDecision: 0,
    [AssessmentDecision.Hold]: 0,
    [AssessmentDecision.Successful]: 0,
    [AssessmentDecision.Unsuccessful]: 0,
  };

  return results.reduce(
    (
      accumulator: ResultDecisionCounts,
      assessmentResult: CandidateAssessmentResult,
    ) => {
      const decision: NullableDecision =
        assessmentResult.decision ?? NO_DECISION;
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

const getBookmarkValue = (result: CandidateAssessmentResult) => {
  return Number(result.poolCandidate?.isBookmarked);
};
const getDecisionValue = (decision: NullableDecision) => {
  return decisionOrder.indexOf(decision ?? NO_DECISION);
};
const getPriorityValue = (result: CandidateAssessmentResult) => {
  return Number(result.poolCandidate?.user.hasPriorityEntitlement);
};
const getVeteranValue = (result: CandidateAssessmentResult) => {
  return Number(
    result.poolCandidate?.user.armedForcesStatus === ArmedForcesStatus.Veteran,
  );
};
const compareLastNames = (
  resultA: CandidateAssessmentResult,
  resultB: CandidateAssessmentResult,
) => {
  const user1Name: string = resultA.poolCandidate?.user.lastName || "";
  const user2Name: string = resultB.poolCandidate?.user.lastName || "";
  return user1Name.localeCompare(user2Name);
};
const compareFirstNames = (
  resultA: CandidateAssessmentResult,
  resultB: CandidateAssessmentResult,
) => {
  const user1Name: string = resultA.poolCandidate?.user.firstName || "";
  const user2Name: string = resultB.poolCandidate?.user.firstName || "";
  return user1Name.localeCompare(user2Name);
};

/** Adds the ordinal for candidates based on their sort order ignoring bookmarks
 * then resorts them with bookmarking and returns the result
 */
export const sortResultsAndAddOrdinal = (
  results: CandidateAssessmentResult[],
): (CandidateAssessmentResult & { ordinal: number })[] => {
  // Do the first sort to determine order without bookmarking
  const firstSortResults = results.sort((resultA, resultB) => {
    return (
      getDecisionValue(resultA.decision) - getDecisionValue(resultB.decision) ||
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
      getDecisionValue(resultA.decision) - getDecisionValue(resultB.decision) ||
      getPriorityValue(resultB) - getPriorityValue(resultA) ||
      getVeteranValue(resultB) - getVeteranValue(resultA) ||
      compareLastNames(resultA, resultB) ||
      compareFirstNames(resultA, resultB)
    );
  });
};
